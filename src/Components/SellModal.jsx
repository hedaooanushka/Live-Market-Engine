import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios'




export default function SellModal(props) {
    if (!props?.showSellModal) {
        return <></>;
    }

    const [numStocks, setNumStocks] = useState(1)
    const [totalPrice, setTotalPrice] = useState(0)
    const [stocksToSell, setStocksToSell] = useState(0)
    const [stocksBought, setStocksBought] = useState(0)
    const [portfolioInfo, setPortfolioInfo] = useState([])
    const [currentBalance, setCurrentBalance] = useState(25000)
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const currentPrice = parseFloat(numStocks * props?.latest_price).toFixed(2)
        setTotalPrice(currentPrice);
    }, [numStocks]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('http://localhost:3000/portfolio');
            console.log("Data == ", JSON.stringify(result.data));
            setCurrentBalance((result.data.current_balance).toFixed(2));
            setPortfolioInfo(result.data.investments);
            result.data.investments.forEach((item) => {
                if (item.ticker === props?.ticker) {
                    setStocksBought( item.quantity); // Make sure this is the correct property
                    console.log("stocks bought =", item.quantity);
                }
            });
        };
        fetchData();
        console.log("stocksBought = ", stocksBought);
    }, [])

    const handleNumStocksChange = (e) => {
        const value = Number(e.target.value);
        console.log("value = ", value);
        setNumStocks(value);
        console.log("stocksBoutght = ", stocksBought)  ;
        if (value > stocksBought) {
            setShowAlert(true);
        }
        else {
            setShowAlert(false);
        }
        // console.log(props.info)
    }

    const callBackend = () => {
       
        console.log("inside portfolio frontend callback")
        axios.post('http://localhost:3000/sell', { price: totalPrice, quantity: numStocks, ticker: props?.ticker, company: props?.company })
            .then((res) => {
                props.toggleSellModal();
            }).catch((err) => {
                console.log(err);
            })
    }

    return (
        <>
            {/* SELL MODAL */}
            <Modal className="my-modal" show={props?.showSellModal} onHide={props?.toggleSellModal} >
                <Modal.Dialog style={{ width: '100%', height: '100%' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>{props?.ticker}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Current Price: {props?.latest_price}</p>
                        <p>Money in wallet: ${currentBalance}</p>
                        <p>Quantity: </p>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="text" placeholder="No of stocks to Sell" value={numStocks} onChange={handleNumStocksChange} autoComplete="off" />
                            </Form.Group>
                        </Form>
                        {showAlert && <p style={{ color: 'red' }}>You cannot sell the stocks that you don't have!</p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <p className="text-left">Total:{totalPrice}</p>
                        <Button variant="success" onClick={callBackend} type='submit' disabled={showAlert}>Sell</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        </>
    )
}