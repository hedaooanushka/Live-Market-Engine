import axios from 'axios'
import { useEffect, useState } from 'react';
export default function Portfolio() {

    const [data, setData] = useState([]);
    const [prices, setPrices] = useState({});
    const [currentBalance, setCurrentBalance] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('http://localhost:3000/portfolio');
          
            console.log("Data == ", JSON.stringify(result.data));
            setCurrentBalance(result.data.current_balance);
            // Broo adding this comments for you, once you understood it you can remove it
            // Create an empty object to hold the combined investments
            const combinedInvestments = {};
            const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));
            // Loop through the investments
            result.data?.investments?.forEach(item => {
                // If the ticker already exists in the combined investments
                if (combinedInvestments[item.ticker]) {
                    // Add the quantity and price to the existing entry
                    combinedInvestments[item.ticker].quantity += item.quantity;
                    combinedInvestments[item.ticker].price = parseFloat(combinedInvestments[item.ticker].price) + parseFloat(item.price);
                } else {
                    // If the ticker doesn't exist, add a new entry
                    combinedInvestments[item.ticker] = item;
                }
            });

            // Convert the combined investments object back into an array
            const combinedInvestmentsArray = Object.values(combinedInvestments);
            setData(combinedInvestmentsArray);
            console.log("combinedInvestmentsArray == ", JSON.stringify(combinedInvestmentsArray));
            // Fetch the current prices
            const pricePromises = combinedInvestmentsArray.map(async (item, index) => {
                await delay(1000); // Wait for 1 second between each request
                const priceResult = await axios.get(`http://localhost:3000/current_stock_price?ticker_name=${item.ticker}`);
                return { ticker: item.ticker, price: priceResult.data.c, quantity: item.quantity };
            });
            if (pricePromises) {
                const prices = await Promise.all(pricePromises);
                setPrices(prices); // Store the prices as an array
            }
        };

        fetchData();
        console.log("Prices == ", JSON.stringify(prices));
    }, []);



    return (
        <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: "70%", marginTop: "5%", marginLeft: 'auto', marginRight: 'auto' }}>
                < div className="container-fluid"  >
                    <div className="row">
                        <div className="col-12">
                            <h1>My Portfolio</h1>
                        </div>
                        <div className="col-12">
                            <h3 style={{ color: "#323232" }}>Money in Wallet : ${currentBalance ? (currentBalance).toFixed(2) : '0.00'}</h3>
                        </div>
                        {data?.map((item, index) => (
                            <div className="col-12 mt-3" key={index} style={{minWidth:'500px'}}>
                                <div className='container-fluid' style={{ backgroundColor: "#f5f5f5", padding: '0px', border: 'solid 1px', borderRadius: '7px' }}>
                                    <div className='row'>
                                        <div className='col-2 mx-3'>
                                            <h2>{item.ticker}</h2>
                                        </div>
                                        <div className='col-2 ms-0' style={{ marginTop: '6px' }}>
                                            <h4 style={{ color: "#555a5a" }}>{item.company}</h4>
                                        </div>
                                    </div>
                                    <hr className='m-0' />
                                    <div className='container-fluid mt-0' style={{ backgroundColor: 'white', paddingTop: "1%", paddingBottom: "1%", fontSize:'10px' }}>
                                        <div className='row'>
                                            <div className='col-4'>
                                                <h5>Quantity:</h5>
                                            </div>
                                            <div className='col-2'>
                                                <h5>{item.quantity}</h5>
                                            </div>
                                            <div className='col-4'>
                                                <h5>Change:</h5>
                                            </div>
                                            <div className='col-2'>
                                                <h5>{(item.price / item.quantity - prices[index]?.price).toFixed(2)}</h5>
                                            </div>
                                        </div>
                                        {/* Similar changes for other rows */}
                                        <div className='row'>
                                            <div className='col-4'>
                                                <h5>Avg Cost / Share:</h5>
                                            </div>
                                            <div className='col-2'>
                                                <h5>{(item.price / item.quantity).toFixed(2)}</h5>
                                            </div>
                                            <div className='col-4'>
                                                <h5>Current Price:</h5>
                                            </div>
                                            <div className='col-2'>
                                                <h5>{prices[index]?.price}</h5>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-4'>
                                                <h5>Total Cost:</h5>
                                            </div>
                                            <div className='col-2'>
                                                <h5>{item.price}</h5>
                                            </div>
                                            <div className='col-4'>
                                                <h5>Market Value:</h5>
                                            </div>
                                            <div className='col-2'>
                                                <h5>{prices[index]?.price * item.quantity}</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0' />
                                    <div className='row'>
                                        <div className='container'>
                                            <button className='btn btn-primary m-2'>Buy</button>
                                            <button className='btn btn-danger'>Sell</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}