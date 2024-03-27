const express = require('express')
const axios = require('axios')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const username = "anushka"
const password = "vGf17pdWPlYRyWlW"
const uri = `mongodb+srv://${username}:${password}@cluster0.drk46si.mongodb.net/?retryWrites=true&w=majority`;
// mongodb+srv://anushka:vGf17pdWPlYRyWlW@cluster0.drk46si.mongodb.net/?retryWrites=true&w=majority


const app = express()
const port = 3000
const finnhub_API_KEY = "cn23u1hr01qmg1p4fpjgcn23u1hr01qmg1p4fpk0"
const POLYGON_API_KEY = "zwVPTZUN52Kmef7FZFscrMwGZClJpJiv"

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'web_assignment_3';

// Create a new MongoClient

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.connect();
let last;

function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2); // months are 0-indexed
    const day = ('0' + now.getDate()).slice(-2);
    const dayIndex = now.getDay();

    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);

    const currentDate = `${year}-${month}-${day}`;
    const currentTime = `${hours}:${minutes}:${seconds}`;
    const currentDateTime = `${currentDate} ${currentTime}`;
    return {
        Date: currentDate,
        Time: currentTime,
        DateTime: currentDateTime
    }
}

function unixToOriginal(unixTimestamp) {
    const now = new Date(unixTimestamp * 1000);
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2); // months are 0-indexed
    const day = ('0' + now.getDate()).slice(-2);
    const dayIndex = now.getDay();

    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);

    const currentDate = `${year}-${month}-${day}`;
    const currentTime = `${hours}:${minutes}:${seconds}`;
    const currentDateTime = `${currentDate} ${currentTime}`;
    return {
        Date: currentDate,
        Time: currentTime,
        DateTime: currentDateTime
    }
}

async function run() {
    try {
        // To get all the watchlist items
        app.get('/watchlist', async (req, res) => {
            // await client.connect();
            await client.db(dbName).command({ ping: 1 });
            // console.log("Connected successfully to MongoDB server");
            const watchlist = client.db(dbName).collection('watchlist');
            const watchlistItems = await watchlist.find({ userId: 'user1' }).toArray();
            // await client.close();
            res.json(watchlistItems[0].watchlist);
        });

        // To add a new item to the watchlist
        app.post('/watchlist', async (req, res) => {
            const body = req.body;
            const ticker = body.ticker || "";
            const watchlist = client.db(dbName).collection('watchlist');
            const watchlistItems = await watchlist.find({ userId: 'user1' }).toArray();
            const watchlistData = watchlistItems[0].watchlist;
            for (let i = 0; i < watchlistData.length; i++) {
                if (watchlistData[i].ticker === ticker) {
                    return res.json({ status: 'ALready present', message: 'Ticker already present in the watchlist.' });
                }
            }
            const result = await watchlist.updateOne(
                { userId: 'user1' },
                { $push: { watchlist: body } }
            );
            res.json(result);
        });

        // To delete an item from the watchlist
        app.post("/deleteWatchlistItem", async (req, res) => {
            const body = req.body;
            const ticker = body.ticker || "";
            const watchlist = client.db(dbName).collection('watchlist');
            const result = await watchlist.updateOne(
                { userId: 'user1' },
                { $pull: { watchlist: { ticker: ticker } } }
            );
            res.json(result);
        });

        // Fetch documents from the portfolio collection where userId is "user1"
        app.get('/portfolio', async (req, res) => {
            await client.db(dbName).command({ ping: 1 });
            const portfolio = client.db(dbName).collection('portfolio');
            const portfolioItems = await portfolio.find({ userId: 'user1' }).toArray();
            const finalData = {
                current_balance: portfolioItems[0].current_balance,
                investments: portfolioItems[0].investments
            }
            res.json(finalData);
        });

        // To add a new item to the portfolio
        app.post('/buy', async (req, res) => {
            const body = req.body;
            const price = body.price || 0;
            const quantity = body.quantity || 0;
            const ticker = body.ticker || "";
            const portfolio = client.db(dbName).collection('portfolio');
            const portfolioItems = await portfolio.find({ userId: 'user1' }).toArray();
            let investments = portfolioItems[0].investments;
            let isPresent = false;
            for (let i = 0; i < investments.length; i++) {
                if (investments[i].ticker === ticker) {
                    // console.log("Found the ticker investments[i].ticker = " + investments[i].ticker)
                    investments[i].quantity += quantity;
                    investments[i].price = parseFloat(investments[i].price) + parseFloat(price);
                    isPresent = true;
                    break;
                }
            }
            if (!isPresent) {
                investments.push(body);
            }
            // Update the 'portfolio' document where userId is 'user1'
            const result = await portfolio.findOneAndUpdate(
                { userId: 'user1' },
                {
                    $set: { investments: investments },
                    $inc: { current_balance: -price }
                },
                { returnOriginal: false } // Option to return the updated document
            );
            res.json(result.value); // Send the updated document to the client
        });

        // To delete an item from the watchlist
        app.post("/sell", async (req, res) => {
            const body = req.body;
            const price = body.price || 0;
            const quantity = body.quantity || 0;
            const ticker = body.ticker || "";
            const portfolio = client.db(dbName).collection('portfolio');
            const portfolioItems = await portfolio.find({ userId: 'user1' }).toArray();
            const investments = portfolioItems[0].investments;
            for (let i = 0; i < investments.length; i++) {
                if (investments[i].ticker === ticker) {
                    investments[i].quantity -= quantity;
                    investments[i].price = parseFloat(investments[i].price) - parseFloat(price);
                    if (investments[i].quantity === 0) {
                        investments.splice(i, 1);
                    }
                    break;
                }
            }
            const result = await portfolio.findOneAndUpdate(
                { userId: 'user1' },
                {
                    $set: { investments: investments },
                    $inc: { current_balance: parseFloat(price) }
                },
                { returnOriginal: false } // Option to return the updated document
            );
            res.json(result.value); // Send the updated document to the client
        });

        app.get('/', (req, res) => {
            res.send('Hello World!')
        })

        app.get('/autocomplete', (req, res) => {
            const query = req.query.query;
            axios.get(`https://finnhub.io/api/v1/search?q=${query}&token=${finnhub_API_KEY}`)
                .then((result) => {
                    const suggestions = result.data.result
                    res.json(suggestions);
                })
                .catch((error) => {
                    console.error('An error occurred:', error);
                    res.status(500).send({ status: 'error', message: 'An error occurred fetching data from the API.' });
                });
        })

        app.get('/summary', (req, res) => {
            const ticker_name = req.query.ticker_name.toUpperCase();

            const profilePromise = axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker_name}&token=${finnhub_API_KEY}`);
            const latestPricePromise = axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker_name}&token=${finnhub_API_KEY}`);
            const peersPromise = axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${ticker_name}&token=${finnhub_API_KEY}`);
            const marketStatus = axios.get(`https://api.polygon.io/v1/marketstatus/now?apiKey=${POLYGON_API_KEY}`)

            Promise.all([profilePromise, latestPricePromise, peersPromise, marketStatus])
                .then((results) => {
                    const profile = results[0].data;
                    const latestPrice = results[1].data;
                    const peers = results[2].data;
                    const marketStatus = results[3].data;
                    last = unixToOriginal(results[1].data.t);
                    res.json({ profile: profile, latest_price: latestPrice, peers: peers, marketStatus: marketStatus });
                })
                .catch((error) => {
                    console.error('An error occurred:', error);
                    res.status(500).send({ status: 'error', message: 'An error occurred fetching data from the API.' });
                });
        });

        app.get('/current_stock_price', (req, res) => {
            const ticker_name = req.query.ticker_name.toUpperCase();

            // https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/hour/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=zwVPTZUN52Kmef7FZFscrMwGZClJpJiv
            axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker_name}&token=${finnhub_API_KEY}`)
                .then((result) => {
                    const status = result.data;
                    // console.log("quote data"+ result.data)
                    res.json(status);
                })
                .catch((error) => {
                    console.error('An error occurred:', error);
                    res.status(500).send({ status: 'error', message: 'An error occurred fetching data from the API.' });
                });
        })

        app.get('/summary-charts', (req, res) => {
            const ticker_name = req.query.ticker_name.toUpperCase();
            const current = getCurrentTime();
            let to_date;
            let from_date;
            if ((current.dayIndex == 6) || (current.dayIndex == 0)) {  // saturday
                to_date = last.Date;
                from_date = new Date(to_date);
                from_date.setDate(from_date.getDate() - 1);
                from_date = from_date.toISOString().split('T')[0];
            } else {
                to_date = current.Date
                from_date = new Date(to_date);
                from_date.setDate(from_date.getDate() - 1);
                from_date = from_date.toISOString().split('T')[0];
            }

            // https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/hour/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=zwVPTZUN52Kmef7FZFscrMwGZClJpJiv
            axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker_name}/range/1/hour/${from_date}/${to_date}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`)
                .then((result) => {
                    const summary_chart = result.data;
                    res.json(summary_chart);
                })
                .catch((error) => {
                    console.error('An error occurred:', error);
                    res.status(500).send({ status: 'error', message: 'An error occurred fetching data from the API.' });
                });
        })

        app.get("/news", (req, res) => {
            const ticker_name = req.query.ticker_name.toUpperCase();

            const current = getCurrentTime();
            const to_date = current.Date;

            let from_date = new Date(to_date);
            from_date.setDate(from_date.getDate() - 7);
            from_date = from_date.toISOString().split('T')[0];

            axios.get(`https://finnhub.io/api/v1/company-news?symbol=${ticker_name}&from=${from_date}&to=${to_date}&token=${finnhub_API_KEY}`)
                .then((result) => {
                    const news = result.data;
                    // console.log(news)
                    res.json(news);
                })
                .catch((error) => {
                    console.error('An error occurred:', error);
                    res.status(500).send({ status: 'error', message: 'An error occurred fetching data from the API.' });
                });
        })

        app.get("/charts", (req, res) => {
            const ticker_name = req.query.ticker_name.toUpperCase();
            const current = getCurrentTime();

            const to_date = current.Date
            let from_date = new Date(to_date);
            from_date.setFullYear(from_date.getFullYear() - 2);
            from_date = from_date.toISOString().split('T')[0];

            // https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2022-03-16/2024-03-17?adjusted=true&sort=asc&apiKey=zwVPTZUN52Kmef7FZFscrMwGZClJpJiv
            axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker_name}/range/1/day/${from_date}/${to_date}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`)
                .then((result) => {
                    const big_chart = result.data;
                    res.json(big_chart);
                })
                .catch((error) => {
                    console.error('An error occurred:', error);
                    res.status(500).send({ status: 'error', message: 'An error occurred fetching data from the API.' });
                });
        })

        app.get("/insights", (req, res) => {
            const ticker_name = req.query.ticker_name.toUpperCase();
            const from_date = ""
            //https://finnhub.io/api/v1/stock/insider-sentiment?symbol=AAPL&from=2022-01-01&token=cn23u1hr01qmg1p4fpjgcn23u1hr01qmg1p4fpk0
            const mspr = axios.get(`https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${ticker_name}&from=2022-01-01&token=${finnhub_API_KEY}`)
            const eps = axios.get(`https://finnhub.io/api/v1/stock/earnings?symbol=${ticker_name}&token=${finnhub_API_KEY}`)
            const recommendation = axios.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker_name}&token=${finnhub_API_KEY}`)
            Promise.all([mspr, eps, recommendation])
                .then((results) => {
                    const mspr = results[0].data;
                    const eps = results[1].data;
                    const recommendation = results[2].data;
                    res.json({ mspr: mspr, eps: eps, recommendation: recommendation });
                })
                .catch((error) => {
                    console.error('An error occurred:', error);
                    res.status(500).send({ status: 'error', message: 'An error occurred fetching data from the API.' });
                });

        })

        app.listen(port, async () => {
            console.log("Server started...")
        })
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}


run().catch(console.dir);
