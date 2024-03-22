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

    if (props?.ticker_name === "default" && props?.dataValid === false) {
        return (
            <></>
        )
    }
    else if (props?.ticker_name === "" && props?.dataValid === false && props.click === true) {
        return (
            <div className='d-flex justify-content-center align-items-center'>
                <div className='alert alert-danger' role='alert' style={{ textAlign: 'center', width: '60%' }}>
                    Please enter a valid ticker
                </div>
            </div>
        )
    }
    // else if (props?.ticker_name !== "" && props?.dataValid === false && props.click === true){
    //     return (
    //         <div className='d-flex justify-content-center align-items-center'>
    //             <div className='alert alert-danger' role='alert' style={{ textAlign: 'center', width: '60%' }}>
    //                 No Data Found. Please enter a valid Ticker
    //             </div>
    //         </div>
    //     )
    // }
    else if (props?.isLoading === true && props?.ticker_name !== "" && props?.dataValid === false && props.click === true) {
        return (
            <div>
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status"></div>
                </div>
            </div>
        )
    }
    else if (props?.isLoading === false && props?.ticker_name !== "" && props?.dataValid === false && props.click === true) {
        return (
            <div className='d-flex justify-content-center align-items-center'>
                <div className='alert alert-danger' role='alert' style={{ textAlign: 'center', width: '60%' }}>
                    No Data Found. Please enter a valid Ticker
                </div>
            </div>
        )
    }
    else if (props.dataValid) {

        // t converted to actual format
        const unixTimestamp = props?.info?.latest_price?.t;
        const date = new Date(unixTimestamp * 1000);
        const formattedDate = date.getFullYear() + '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('0' + date.getDate()).slice(-2) + ' ' +
            ('0' + date.getHours()).slice(-2) + ':' +
            ('0' + date.getMinutes()).slice(-2) + ':' +
            ('0' + date.getSeconds()).slice(-2);

        // getting wrong hours, minutes, seconds, need to fix this
        const currentDay = date.getDay();
        const currentHour = date.getHours();
        const currentMinute = date.getMinutes();
        const currentSecond = date.getSeconds();

        console.log("hours" + currentHour)
        console.log("minutes" + currentMinute)
        console.log("sec" + currentSecond)



        // console.log(formattedDate);
        const [isStarSelected, setIsStarSelected] = useState(false);
        const [showAlert, setShowAlert] = useState(false);
        const [color, setColor] = useState('red');

        const [currentBalance, setCurrentBalance] = useState(0);
        const [showBuyModal, setShowBuyModal] = useState(false);
        const [showSellModal, setShowSellModal] = useState(false);
        const [showBuyButton, setShowBuyButton] = useState(true);
        const [showSellButton, setShowSellButton] = useState(true);
        const [reRender, setReRender] = useState(false);


        const toggleBuyModal = () => {
            setShowBuyModal(!showBuyModal);
            setReRender(!reRender);
            setShowAlert(false);
        }
        const toggleSellModal = () => {
            setShowSellModal(!showSellModal);
            setReRender(!reRender);
            setShowAlert(false);
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
            axios.get(`http://localhost:3000/portfolio?ticker_name=${props?.ticker_name}`)
                .then(response => {
                    // console.log(response.data.current_balance)
                    setCurrentBalance(response.data.current_balance)
                    // console.log("CB"+currentBalance);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
            setShowBuyModal(true);
        };

        const sell = () => {
            // axios call to fetch total money in wallet
            setShowSellModal(true);
        };



        const handleStarClick = async (item) => {
            setIsStarSelected(!isStarSelected);
            console.log("item sent to handle star click = " + JSON.stringify(item))
            // call the backend to add the ticker to the watchlist
            axios.post(`http://127.0.0.1:3000/watchlist?ticker_name=${props?.ticker_name}`, JSON.stringify(item))
                .then(response => {
                    console.log("Added company = " + JSON.stringify(response))
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
            setShowAlert(true);
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


        return (
            <><div key={reRender}>
                <div className='d-flex justify-content-center align-items-center'>
                    {showAlert && (
                        <div className='alert alert-success' role='alert' style={{ textAlign: 'center', width: '60%' }}>
                            Ticker added to watchlist
                        </div>
                    )}
                </div>
                <div className="d-flex flex-row bd-highlight mx-auto" style={{ textAlign: 'center', justifyContent: 'space-around', width: '80%' }}>
                    <div className="p-2 bd-highlight">
                        <p><span style={{ fontSize: '32px', fontWeight: 'bold' }}>{props?.info?.profile?.ticker}</span>
                            <svg className="ms-2 mb-4 bi bi-star m-1 star"
                                onClick={() => handleStarClick({
                                    ticker: props?.info?.profile?.ticker,
                                    name: props?.info?.profile?.name,
                                    c: props?.info?.latest_price?.c,
                                    dp: props?.info?.latest_price?.dp
                                })} type="button" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={isStarSelected ? "yellow" : "currentColor"} viewBox="0 0 16 16">
                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
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
                            <BuyModal showBuyModal={showBuyModal} toggleBuyModal={toggleBuyModal} currentBalance={currentBalance} info={props?.info} />
                            <SellModal showSellModal={showSellModal} toggleSellModal={toggleSellModal} currentBalance={currentBalance} info={props?.info} />
                        </div>
                    </div>
                    <div className="pt-4 pe-5 bd-highlight">
                        <img src={props?.info?.profile?.logo} style={{ width: '100px' }}></img>
                    </div>
                    <div className="p-2 pe-5 bd-highlight">
                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: color }}>{props?.info?.latest_price?.c}</span> <br />
                        {props?.info?.latest_price?.d > 0 ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                            </svg>
                        }

                        <span style={{ fontSize: '17px', color: color }}> {props?.info?.latest_price?.d} ({props?.info?.latest_price?.dp}%)</span> <br />
                        <span style={{ fontSize: '13px' }}> {formattedDate}</span>
                    </div>
                </div>
                <div className="container" style={{textAlign:'center'}}>
                    {(currentDay == 0 || currentDay == 6 || (currentHour <= 12 && currentMinute >= 0 && currentSecond >= 0) || (currentHour >= 9 && currentMinute >= 0 && currentSecond >= 0)) ? <span style={{ color: 'red', fontWeight: 'bold' }}>Market closed on {formattedDate}</span> : <span style={{ color: 'green', fontWeight: 'bold' }}>Market is open!</span>}
                </div>
            </div>
            </>
        )
    }

}
