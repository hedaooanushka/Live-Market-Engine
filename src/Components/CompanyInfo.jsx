import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import '../static/Tabs.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import BuyModal from './BuyModal.jsx'
import SellModal from './SellModal.jsx'




export default function CompanyInfo(props) {
    // console.log("isdatavalid = " + props.dataValid)
    // console.log("isClick = " + props.click)
    // console.log("ticker name = " + props?.ticker_name)
    // console.log("info", props?.info)
    // console.log(props?.info?.marketStatus?.exchanges?.nasdaq)
    // console.log("isLoading = " + props?.isLoading)
    // const [doneLoading, setDoneLoading] = useState(false);
    // console.log("hide = " + props.hide)

    // console.log("props.last = "+JSON.stringify(props?.last))
    // console.log("props.now = "+JSON.stringify(props?.now))
    // const last = props?.last?.DateTime;
    // const now = props?.now?.DateTime;
    // console.log("last = " + JSON.stringify(last));
    // console.log("now = " + JSON.stringify(now));

    // const isMarketOpen = (now, last) => {
    //     let curr = new Date(now);
    //     let lastClosed = new Date(last);

    //     let differenceInMilliseconds = curr - lastClosed;
    //     let differenceInSeconds = differenceInMilliseconds / 1000;
    //     let differenceInMinutes = differenceInSeconds / 60;
    //     console.log("difference ms = " + differenceInMilliseconds)
    //     console.log("difference sec = " + differenceInSeconds)
    //     console.log("difference min = " + differenceInMinutes)
    //     if (differenceInMinutes > 5) return false;
    //     else return true;
    // }


    if ((props?.ticker_name === "default" && props?.dataValid === false) || props?.hide) {
        return (
            <></>
        )
    }
    else if (props?.ticker_name === "" && props?.dataValid === false && props?.click === true) {
        return (
            <div className='d-flex justify-content-center align-items-center'>
                <div className='alert alert-danger' role='alert' style={{ textAlign: 'center', width: '60%' }}>
                    Please enter a valid ticker
                </div>
            </div>
        )
    }
    else if (props?.isLoading === true && props?.ticker_name !== "" && props?.dataValid === false && props?.click === true) {
        return (
            <div>
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status"></div>
                </div>
            </div>
        )
    }
    else if (props?.isLoading === false && props?.ticker_name !== "" && props?.dataValid === false && props?.click === true) {
        return (
            <div className='d-flex justify-content-center align-items-center'>
                <div className='alert alert-danger' role='alert' style={{ textAlign: 'center', width: '60%' }}>
                    No Data Found. Please enter a valid Ticker
                </div>
            </div>
        )
    }
    else if (props?.dataValid) {
        console.log("ticker_name in company info = " + props?.ticker_name)
        const currentDate = () => {
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
                DateTime: currentDateTime
            }
        }
        const [currentTime, setCurrentTime] = useState(currentDate().DateTime);
        useEffect(() => {
            const timer = setInterval(() => {
                setCurrentTime(currentDate().DateTime);
                console.log(currentTime)
            }, 15000);
            return () => clearInterval(timer);
        }, [currentTime]);

        // t converted to actual format
        // const unixTimestamp = props?.info?.latest_price?.t;
        // const date = new Date(unixTimestamp * 1000);
        // const formattedDate = date.getFullYear() + '-' +
        //     ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        //     ('0' + date.getDate()).slice(-2) + ' ' +
        //     ('0' + date.getHours()).slice(-2) + ':' +
        //     ('0' + date.getMinutes()).slice(-2) + ':' +
        //     ('0' + date.getSeconds()).slice(-2);

        // // getting wrong hours, minutes, seconds, need to fix this
        // const currentDay = date.getDay();
        // const currentHour = date.getHours();
        // const currentMinute = date.getMinutes();
        // const currentSecond = date.getSeconds();

        const [isStarSelected, setIsStarSelected] = useState(false);
        const [showAlert, setShowAlert] = useState(false);
        const [color, setColor] = useState('red');

        const [currentBalance, setCurrentBalance] = useState(0);
        const [showBuyModal, setShowBuyModal] = useState(false);
        const [showSellModal, setShowSellModal] = useState(false);
        const [showBuyButton, setShowBuyButton] = useState(true);
        const [showSellButton, setShowSellButton] = useState(false);
        const [reRender, setReRender] = useState(false);
        const [ticker, setTicker] = useState('');
        const [current_price, setCurrentPrice] = useState(0);
        const [company, setCompany] = useState('');
        const [successBuyMessage, setSuccessBuyMessage] = useState(false);
        const [successSellMessage, setSuccessSellMessage] = useState(false);
        const [isWishlisted, setIsWishlisted] = useState(false);


        const toggleBuyModal = () => {
            setShowBuyModal(!showBuyModal);
            setReRender(!reRender);
        }
        const toggleSellModal = () => {
            setShowSellModal(!showSellModal);
            setReRender(!reRender);


        }
        const toggleBuyMessage = () => {
            setSuccessBuyMessage(!successBuyMessage);
            axios.get(`http://localhost:3000/portfolio`)
                .then(response => {
                    const investments = response.data.investments;
                    console.log("investments = " + JSON.stringify(investments));
                    for (let i = 0; i < investments.length; i++) {
                        if (investments[i].ticker === props?.ticker_name.toUpperCase()) {
                            setShowSellButton(true);
                            return;
                        }
                    }
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });

        }
        const toggleSellMessage = () => {
            setSuccessSellMessage(!successSellMessage);

        }
        // const getValues = ()=>{
        //     axios.get(`http://localhost:3000/portfolio?ticker_name=${props?.ticker_name}`)
        //         .then(response => {
        //             // console.log(response.data.current_balance)
        //             setCurrentBalance(response.data.current_balance)
        //             // console.log("CB"+currentBalance);
        //         })
        //         .catch(error => {
        //             console.error('An error occurred:', error);
        //         });
        // }

        const buy = () => {
            // axios call to fetch total money in wallet
            axios.get(`http://localhost:3000/portfolio`)
                .then(response => {
                    // console.log(response.data.current_balance)
                    setCurrentBalance(response.data.current_balance)
                    // console.log("CB"+currentBalance);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
            setShowBuyModal(true);
            setTicker(props?.info?.profile?.ticker);
            setCurrentPrice(props?.info?.latest_price?.c);
            setCompany(props?.info?.profile?.name);
        };

        const sell = () => {
            // axios call to fetch total money in wallet
            setShowSellModal(true);
            setTicker(props?.info?.profile?.ticker);
            setCurrentPrice(props?.info?.latest_price?.c);
            setCompany(props?.info?.profile?.name);
        };


        useEffect(() => {
            axios.get(`http://localhost:3000/portfolio`)
                .then(response => {
                    const investments = response.data.investments;
                    console.log("investments = " + JSON.stringify(investments));
                    for (let i = 0; i < investments.length; i++) {
                        if (investments[i].ticker === props?.ticker_name.toUpperCase()) {
                            setShowSellButton(true);
                            return;
                        }
                    }
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });

            //setTimeout(() => {
            axios.get(`http://localhost:3000/watchlist`).then(response => {
                const watchlist = response.data;
                console.log("watchlist = " + JSON.stringify(watchlist));
                for (let i = 0; i < watchlist.length; i++) {
                    if (watchlist[i].ticker.toLowerCase() === props?.ticker_name.toLowerCase()) {
                        setIsStarSelected(true);
                        return;
                    }
                }
            }).catch(error => {
                console.error('An error occurred:', error);
            });
            //}, 2000); // 2000 milliseconds = 2 seconds
        }, [])


        const handleStarClick = async () => {
            console.log("star clicked, before changing the state = " + isStarSelected);
            setIsStarSelected(!isStarSelected);
            console.log("star clicked, after changing the state = " + isStarSelected);
            if (!isStarSelected) {
                // console.log("item sent to handle star click = " + JSON.stringify(item))
                // call the backend to add the ticker to the watchlist

                axios.post(`http://localhost:3000/watchlist`, { ticker: props?.ticker_name, name: props?.info?.profile?.name })
                    .then(response => {
                        console.log("Added company = " + JSON.stringify(response))
                    })
                    .catch(error => {
                        console.error('An error occurred:', error);
                    });
                setShowAlert(true);
            }
            else {
                axios.post('http://localhost:3000/deleteWatchlistItem', { ticker: props?.ticker_name })
                    .then((res) => {
                        console.log("Deleted")
                        console.log("response ===", JSON.stringify(res.data))
                    }).catch((err) => {
                        console.log(err);
                    })
            }
        };



        const d = props?.info?.latest_price?.d;

        // Calculate today's date
        // const date = new Date();
        // let year = date.getFullYear();
        // let month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero indexed, so we add one
        // let day = ("0" + date.getDate()).slice(-2);
        // let formattedDate = `${year}-${month}-${day}`;
        // // console.log(formattedDate);
        // const to_date = formattedDate;

        useEffect(() => {
            if (d > 0) {
                setColor('green')
            } else {
                setColor('red')
            }
        }, [d])
        const closeBuyMessage = () => {
            setSuccessBuyMessage(false);
        }
        const closeSellMessage = () => {
            setSuccessSellMessage(false);
        }
        useEffect(() => {
            if (showAlert || successBuyMessage || successSellMessage) {
                const timer = setTimeout(() => {
                    setShowAlert(false);
                    setSuccessBuyMessage(false);
                    setSuccessSellMessage(false);
                }, 3000);

                return () => clearTimeout(timer);
            }
        }, [showAlert, successBuyMessage, successSellMessage]);
        return (
            <>
                <div key={reRender}>
                    <div className='d-flex justify-content-center align-items-center'>
                        {showAlert && (
                            <div className='alert alert-success' role='alert' style={{ textAlign: 'center', width: '60%' }}>
                                Ticker added to watchlist
                            </div>
                        )}
                        {successBuyMessage && (
                            <div className="container alert alert-success alert-dismissible fade show" role="alert" style={{ textAlign: 'center' }}>
                                {props?.ticker_name.toUpperCase()} bought successfully
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
                            <div className="container alert alert-danger alert-dismissible fade show" role="alert" style={{ textAlign: 'center' }}>
                                {props?.ticker_name.toUpperCase()} sold successfully
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
                    <div className="d-flex flex-row bd-highlight mx-auto" style={{ textAlign: 'center', justifyContent: 'space-around', width: '80%' }}>
                        <div className="p-2 bd-highlight">
                            <p><span style={{ fontSize: '32px', fontWeight: 'bold' }}>{props?.info?.profile?.ticker}</span>
                                <svg onClick={() => handleStarClick()} type="button" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '15px', marginLeft: '10px' }} width="20" height="20" fill={isStarSelected ? "yellow" : "white"} stroke='black' class="bi bi-star-fill" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="yellow" class="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg> */}
                                <br /><span style={{ fontSize: '22px', color: 'gray', position: 'relative', top: '-15px' }}>{props?.info?.profile?.name}</span><br />
                                <span style={{ color: 'gray', fontSize: '15px', position: 'relative', top: '-15px' }}>{props?.info?.profile?.exchange} </span>
                            </p>
                            <div style={{ position: 'relative', top: '-15px' }}>
                                {showBuyButton && <Button className='me-2' onClick={() => { buy() }} variant="success">Buy</Button>}
                                {showSellButton && <Button variant="danger" onClick={() => { sell() }}>Sell</Button>}
                                <BuyModal showBuyModal={showBuyModal} toggleBuyModal={toggleBuyModal} toggleBuyMessage={toggleBuyMessage} currentBalance={currentBalance} ticker={ticker} latest_price={current_price} company={company} />
                                <SellModal showSellModal={showSellModal} toggleSellModal={toggleSellModal} toggleSellMessage={toggleSellMessage} currentBalance={currentBalance} ticker={ticker} latest_price={current_price} company={company} />
                            </div>
                        </div>
                        <div className="pt-4 pe-5 bd-highlight">
                            <img src={props?.info?.profile?.logo} style={{ width: '100px' }}></img>
                        </div>
                        <div className="p-2 pe-5 bd-highlight">
                            <span style={{ fontSize: '20px', fontWeight: 'bold', color: color }}>{props?.info?.latest_price?.c.toFixed(2)}</span> <br />
                            {props?.info?.latest_price?.d > 0 ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                </svg>
                            }

                            <span style={{ fontSize: '17px', color: color }}> {props?.info?.latest_price?.d.toFixed(2)} ({props?.info?.latest_price?.dp.toFixed(2)}%)</span> <br />
                            <span style={{ fontSize: '13px' }}> {currentTime}</span>
                        </div>
                    </div>
                    < div className="mx-auto" style={{ textAlign: 'center' }}>
                        {(!props?.isMarketOpen) ? <span style={{ color: 'red', fontWeight: 'bold' }}>Market closed on {props?.last.DateTime}</span> : <span style={{ color: 'green', fontWeight: 'bold' }}>Market is Open</span>}
                    </div>
                </div>
            </>
        )
    }

}
