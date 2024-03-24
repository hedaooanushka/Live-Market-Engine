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


async function run() {
    try {
        // To get all the watchlist items
        app.get('/watchlist', async (req, res) => {
            await client.connect();
            await client.db(dbName).command({ ping: 1 });
            console.log("Connected successfully to MongoDB server");
            const watchlist = client.db(dbName).collection('watchlist');
            const watchlistItems = await watchlist.find({ userId: 'user1' }).toArray();
            await client.close();
            res.json(watchlistItems[0].watchlist);
        });

        // To add a new item to the watchlist
        app.post('/watchlist', async (req, res) => {
            const body = req.body;
            console.log("request = " + JSON.stringify(body))
            // console.log("data sent to backend = "+body)
            await client.connect();
            const ticker = body.ticker || "";
            console.log("Connected successfully to MongoDB server");
            const watchlist = client.db(dbName).collection('watchlist');
            const watchlistItems = await watchlist.find({ userId: 'user1' }).toArray();
            const watchlistData = watchlistItems[0].watchlist;
            for (let i = 0; i < watchlistData.length; i++) {
                if (watchlistData[i].ticker === ticker) {
                    await client.close();
                    return res.json({ status: 'ALready present', message: 'Ticker already present in the watchlist.' });
                }
            }
            const result = await watchlist.updateOne(
                { userId: 'user1' },
                { $push: { watchlist: body } }
            );
            console.log("result = " + JSON.stringify(result))

            await client.close();
            res.json(result);
        });

        // To delete an item from the watchlist
        app.post("/deleteWatchlistItem", async (req, res) => {
            const body = req.body;
            console.log("request = " + JSON.stringify(body))
            const ticker = body.ticker || "";
            await client.connect();
            console.log("Connected successfully to MongoDB server");
            const watchlist = client.db(dbName).collection('watchlist');
            const result = await watchlist.updateOne(
                { userId: 'user1' },
                { $pull: { watchlist: { ticker: ticker } } }
            );
            console.log("result = " + JSON.stringify(result))
            await client.close();
            res.json(result);
        });
        // Fetch documents from the portfolio collection where userId is "user1"
        app.get('/portfolio', async (req, res) => {
            await client.connect();
            await client.db(dbName).command({ ping: 1 });
            console.log("Connected successfully to MongoDB server");
            const portfolio = client.db(dbName).collection('portfolio');
            // find userId == user1 and ticker=="${ticker_name}"
            const portfolioItems = await portfolio.find({ userId: 'user1' }).toArray();
            const finalData = {
                current_balance: portfolioItems[0].current_balance,
                investments: portfolioItems[0].investments
            }
            console.log(finalData)
            await client.close();
            res.json(finalData);
        });

        // To add a new item to the portfolio
        app.post('/buy', async (req, res) => {
            const body = req.body;
            const price = body.price || 0;
            console.log("price = " + price)
            const quantity = body.quantity || 0;
            const ticker = body.ticker || "";
            await client.connect();
            console.log("Connected successfully to MongoDB server");
            const portfolio = client.db(dbName).collection('portfolio');
            const portfolioItems = await portfolio.find({ userId: 'user1' }).toArray();
            let investments = portfolioItems[0].investments;
            let isPresent = false;
            for (let i = 0; i < investments.length; i++) {
                if (investments[i].ticker === ticker) {
                    console.log("Found the ticker investments[i].ticker = " + investments[i].ticker)
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
            console.log("result = " + JSON.stringify(result))
            await client.close();
            res.json(result.value); // Send the updated document to the client
        });

        // To delete an item from the watchlist
        app.post("/sell", async (req, res) => {
            const body = req.body;
            console.log("request = " + JSON.stringify(body))
            const price = body.price || 0;
            const quantity = body.quantity || 0;
            const ticker = body.ticker || "";
            console.log("price = " + price)

            await client.connect();
            console.log("Connected successfully to MongoDB server");
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
            //remove the item from the investments array
            console.log("result = " + JSON.stringify(result))
            await client.close();
            res.json(result.value); // Send the updated document to the client
        });

        app.get('/', (req, res) => {
            res.send('Hello World!')
        })

        app.get('/autocomplete', (req, res) => {
            const query = req.query.query;
            console.log(query)
            axios.get(`https://finnhub.io/api/v1/search?q=${query}&token=${finnhub_API_KEY}`)
                .then((result) => {
                    const suggestions = result.data.result
                    // console.log(suggestions)
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

                    res.json({ profile: profile, latest_price: latestPrice, peers: peers, marketStatus: marketStatus });
                    // console.log(latestPrice)
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
                    // console.log(summary_chart)
                    res.json(status);
                })
                .catch((error) => {
                    console.error('An error occurred:', error);
                    res.status(500).send({ status: 'error', message: 'An error occurred fetching data from the API.' });
                });
        })

        app.get('/summary-charts', (req, res) => {
            const ticker_name = req.query.ticker_name.toUpperCase();
            const multiplier = 1
            const timespan = "hour"
            const from_date = "2024-02-13"
            const to_date = "2024-02-15"

            // https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/hour/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=zwVPTZUN52Kmef7FZFscrMwGZClJpJiv
            axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker_name}/range/1/${timespan}/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=${POLYGON_API_KEY}`)
                .then((result) => {
                    const summary_chart = result.data;
                    // console.log(summary_chart)
                    res.json(summary_chart);
                })
                .catch((error) => {
                    console.error('An error occurred:', error);
                    res.status(500).send({ status: 'error', message: 'An error occurred fetching data from the API.' });
                });
        })

        app.get("/news", (req, res) => {
            const ticker_name = req.query.ticker_name.toUpperCase();

            const date = new Date();
            let year = date.getFullYear();
            let month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero indexed, so we add one
            let day = ("0" + date.getDate()).slice(-2);
            let formattedDate = `${year}-${month}-${day}`;
            // console.log(formattedDate);
            const to_date = formattedDate;

            date.setDate(date.getDate() - 7)
            year = date.getFullYear();
            month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero indexed, so we add one
            day = ("0" + date.getDate()).slice(-2);
            formattedDate = `${year}-${month}-${day}`;
            const from_date = formattedDate;

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

            // const date = new Date();
            // let year = date.getFullYear();
            // let month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero indexed, so we add one
            // let day = ("0" + date.getDate()).slice(-2);
            // let formattedDate = `${year}-${ month }-${ day }`;
            // console.log(formattedDate);
            // const to_date = formattedDate;

            // date.setDate(date.getDate()-7) 
            // year = date.getFullYear();
            // month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero indexed, so we add one
            // day = ("0" + date.getDate()).slice(-2);
            // formattedDate = `${ year }-${ month }-${ day }`;
            // const from_date = formattedDate;

            // https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2022-03-16/2024-03-17?adjusted=true&sort=asc&apiKey=zwVPTZUN52Kmef7FZFscrMwGZClJpJiv
            axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker_name}/range/1/day/2022-03-16/2024-03-17?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`)
                .then((result) => {
                    const big_chart = result.data;
                    // console.log(big_chart)
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
        await client.close();
    }
}


run().catch(console.dir);
