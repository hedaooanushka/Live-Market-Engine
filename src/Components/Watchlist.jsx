import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Watchlist() {
    const [data, setData] = useState([]);
    const [prices, setPrices] = useState({});
    const deleteFromWatchlist = () => {
        
    }
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('http://localhost:3000/watchlist');
            const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));
            console.log("Data == ", JSON.stringify(result.data));
            setData(result.data);
            const pricePromises = result?.data.map(async (item, index) => {
                await delay(1000); // Wait for 1 second between each request
                const priceResult = await axios.get(`http://localhost:3000/current_stock_price?ticker_name=${item.ticker}`);
                return priceResult.data;
            });
            if (pricePromises) {
                const prices = await Promise.all(pricePromises);
                setPrices(prices); // Store the prices as an array
                console.log("Prices == ", JSON.stringify(prices));
            }
        };
        fetchData();
        
    },[])


    return (
        <>
            <div className="container"  >
                <h1 style={{marginBottom:'20px'}}>My watchlist</h1>
                <div class="card">
                    <svg style={{marginTop:'10px', marginLeft:'10px', cursor:'pointer'}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                    <div class="row g-0">
                        <div class="col-6">
                            <div class="card-body">
                                <h5 class="card-title">Card title</h5>
                                <p class="card-text">This is a wider card </p>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card-body">
                                <h5 class="card-title">Card title</h5>
                                <p class="card-text">This is a wider card</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
