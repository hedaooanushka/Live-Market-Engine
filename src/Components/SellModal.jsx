import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios'




export default function SellModal(props) {
    if (!props?.showSellModal) {
        return <></>;
    }

    const [numStocks, setNumStocks] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [stocksToSell, setStocksToSell] = useState(0)
    const [stocksBought, setStocksBought] = useState(0)
    const [portfolioInfo, setPortfolioInfo] = useState([])
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const currentPrice = parseFloat(numStocks * props?.info?.latest_price?.c).toFixed(2)
        setTotalPrice(currentPrice);
        if (currentPrice > props?.currentBalance) {
            setShowAlert(true);
        } else setShowAlert(false);
    }, [numStocks]);

    const handleNumStocksChange = (e) => {
        const value = Number(e.target.value);
        setStocksToSell(value);
        // console.log(props.info)
    }

    const callBackend = () => {
        console.log("inside portfolio frontend callback")
        axios.get('http://localhost:3000/portfolio')
            .then((response) => {
                props.toggleSellModal();
                console.log("info from portfolio = " + JSON.stringify(response.data));
                setPortfolioInfo(response.data);
                // response.data.forEach((item) => {
                //     if (item.ticker === props?.info?.profile?.ticker) {
                //         setStocksBought(item.quality); // Assuming it's item.quality, check your attribute name
                //         console.log("stocks bought =", item.quality);
                //     }
                // });
            }).catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        portfolioInfo.forEach((item) => {
            if (item.ticker === props?.info?.profile?.ticker) {
                setStocksBought(item.quality); // Make sure this is the correct property
                console.log("stocks bought =", item.quality);
            }
        });
    }, [portfolioInfo, props?.info?.profile?.ticker]);




    return (
        <>
            {/* SELL MODAL */}
            <Modal className="my-modal" show={props?.showSellModal} onHide={props?.toggleSellModal} >
                <Modal.Dialog style={{ width: '100%', height: '100%' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>{props?.info?.profile?.ticker}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Current Price: {props?.info?.latest_price?.c}</p>
                        <p>Money in wallet: ${props?.currentBalance}</p>
                        <p>Quantity: </p>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="text" placeholder="No of stocks to Sell" value={numStocks} onChange={handleNumStocksChange} autoComplete="off" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <p className="text-left">Total:{totalPrice}</p>
                        <Button variant="success" onClick={callBackend} type='submit'>Sell</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        </>
    )
}