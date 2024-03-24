import axios from 'axios'
import { useEffect, useState } from 'react';
import BuyModal from './BuyModal.jsx'
import SellModal from './SellModal.jsx'

export default function Portfolio() {

    const [data, setData] = useState([]);
    const [prices, setPrices] = useState({});
    const [currentBalance, setCurrentBalance] = useState(0);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const [ticker, setTicker] = useState('');
    const [current_price, setCurrentPrice] = useState(0);
    const [company, setCompany] = useState('');
    const [successBuyMessage, setSuccessBuyMessage] = useState(false);
    const [successSellMessage, setSuccessSellMessage] = useState(false);
    const [emptyResponse, setEmptyResponse] = useState(false);
    const toggleBuyModal = () => {
        setShowBuyModal(!showBuyModal);

        setSuccessBuyMessage(!successBuyMessage);
    }
    const toggleSellModal = () => {
        setShowSellModal(!showSellModal);

        setSuccessSellMessage(!successSellMessage);

    }
    const closeBuyMessage = () => {
        setSuccessBuyMessage(false);
    }
    const closeSellMessage = () => {
        setSuccessSellMessage(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('http://localhost:3000/portfolio');

            console.log("Data == ", JSON.stringify(result.data));
            setCurrentBalance(result.data.current_balance);
            const combinedInvestments = {};
            const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));
            if (result.data.investments.length === 0) {
                setEmptyResponse(true);
            }
            else {
                setEmptyResponse(false);
            }
            result.data?.investments?.forEach(item => {

                combinedInvestments[item.ticker] = item;

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
    }, [successBuyMessage, successSellMessage]);

    const buy = (item, currentPrice) => {
        console.log("buying ", ticker);
        setShowBuyModal(true);
        setTicker(item.ticker);
        setCurrentPrice(currentPrice);
        setCompany(item.company);
    }
    const sell = (item, currentPrice) => {
        console.log("selling ", ticker);
        setShowSellModal(true);
        setTicker(item.ticker);
        setCurrentPrice(currentPrice);
        setCompany(item.company);
    }
    useEffect(() => {
        console.log("successBuyMessage = ", successBuyMessage)
    }, [successBuyMessage])
    return (
        <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
            <div className='d-flex justify-content-center align-items-center'>
                {successBuyMessage && (
                    <div className="container alert alert-success alert-dismissible fade show" role="alert" style={{ textAlign: 'center' }}>
                        {ticker.toUpperCase()} bought successfully
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                            onClick={closeBuyMessage}
                        />
                    </div>

                )}
                {successSellMessage && (
                    <div className="container alert alert-success alert-dismissible fade show" role="alert" style={{ textAlign: 'center' }}>
                        {ticker.toUpperCase()} sold successfully
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                            onClick={closeSellMessage}
                        />
                    </div>
                )}

            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: "70%", marginTop: "5%", marginLeft: 'auto', marginRight: 'auto' }}>
                < div className="container-fluid"  >
                    <div className="row">
                        <div className="col-12">
                            <h1>My Portfolio</h1>
                        </div>
                        <div className="col-12">
                            <h3 style={{ color: "#323232" }}>Money in Wallet : ${currentBalance ? (currentBalance).toFixed(2) : '0.00'}</h3>
                        </div>
                        {emptyResponse && (<div className="alert alert-warning alert-dismissible fade show" role="alert" style={{ textAlign: 'center' }}>
                            Currently you don't have any stock in your portfolio.

                        </div>)}
                        {data?.map((item, index) => (
                            <div className="col-12 mt-3" key={index} style={{ minWidth: '500px' }}>
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
                                    <div className='container-fluid mt-0' style={{ backgroundColor: 'white', paddingTop: "1%", paddingBottom: "1%", fontSize: '10px' }}>
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
                                                <h5>{(parseFloat(item.price).toFixed(2))}</h5>
                                            </div>
                                            <div className='col-4'>
                                                <h5>Market Value:</h5>
                                            </div>
                                            <div className='col-2'>
                                                <h5>{(prices[index]?.price * item.quantity).toFixed(2)}</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0' />
                                    <div className='row'>
                                        <div className='container'>
                                            <button className='btn btn-primary m-2' onClick={() => { buy(item, prices[index]?.price) }}>Buy</button>
                                            <button className='btn btn-danger' onClick={() => { sell(item, prices[index]?.price) }}>Sell</button>
                                        </div>
                                    </div>
                                </div>
                                <BuyModal showBuyModal={showBuyModal} toggleBuyModal={toggleBuyModal} currentBalance={currentBalance} ticker={ticker} latest_price={current_price} company={company} />
                                <SellModal showSellModal={showSellModal} toggleSellModal={toggleSellModal} currentBalance={currentBalance} ticker={ticker} latest_price={current_price} company={company} />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}