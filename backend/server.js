const express = require('express')
const axios = require('axios')
const cors = require('cors');


const app = express()
const port = 3000
const finnhub_API_KEY = "cn23u1hr01qmg1p4fpjgcn23u1hr01qmg1p4fpk0"
const POLYGON_API_KEY = "zwVPTZUN52Kmef7FZFscrMwGZClJpJiv"

app.use(cors());

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

            res.json({ profile: profile, latest_price: latestPrice, peers: peers, marketStatus: marketStatus});
            // console.log(latestPrice)
        })
        .catch((error) => {
            console.error('An error occurred:', error);
            res.status(500).send({ status: 'error', message: 'An error occurred fetching data from the API.' });
        });
});

app.get('/summary-charts', (req, res) =>{
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
    let formattedDate = `${year}-${ month }-${ day }`;
    console.log(formattedDate);
    const to_date = formattedDate;
    
    date.setDate(date.getDate()-7) 
    year = date.getFullYear();
    month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero indexed, so we add one
    day = ("0" + date.getDate()).slice(-2);
    formattedDate = `${ year }-${ month }-${ day }`;
    const from_date = formattedDate;

    axios.get(`https://finnhub.io/api/v1/company-news?symbol=${ticker_name}&from=${from_date}&to=${to_date}&token=${finnhub_API_KEY}`)
        .then((result) => {
            const news = result.data;
            console.log(news)
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

app.get("/watchlist", (req, res) => {
    res.send("Hello World!")
})

app.get("/portfolio", (req, res) => {
    res.send("Hello World!")
})



app.listen(port, () => {
    console.log("Server started...")
})