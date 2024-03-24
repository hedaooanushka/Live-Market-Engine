import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import '../static/Tabs.css'
import { useState, useEffect } from 'react'
import axios from 'axios'


export default function BuyModal(props) {
    if (!props?.showBuyModal) {
        return <></>;
    }

    const [totalPrice, setTotalPrice] = useState(0)
    const [numStocks, setNumStocks] = useState(0)
    const [showAlert, setShowAlert] = useState(false);
    


    useEffect(() => {
        const currentPrice = parseFloat(numStocks * props?.latest_price).toFixed(2)
        setTotalPrice(currentPrice);
        if (currentPrice > props?.currentBalance) {
            setShowAlert(true);
        } else setShowAlert(false);
    }, [numStocks]);

    const handleNumStocksChange = (e) => {
        const value = Number(e.target.value);
        setNumStocks(value);
        console.log(props.info)
    }

    const callBackend = () => {
        axios.post('http://localhost:3000/buy', { price: totalPrice, quantity: numStocks, ticker: props?.ticker, company: props?.company })
            .then((res) => {
                props.toggleBuyModal();
       
            }).catch((err) => {
                console.log(err);
            })
    }

    return (
        <>
            {/* BUY MODAL */}
           
            <Modal className="my-modal" show={props?.showBuyModal} onHide={props?.toggleBuyModal} >
                <Modal.Dialog style={{ width: '100%', height: '100%' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>{props?.ticker}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Current Price: {props?.latest_price}</p>
                        <p>Money in wallet: ${props?.currentBalance.toFixed(2)}</p>
                        <p>Quantity: </p>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="text" placeholder="No of stocks to buy" value={numStocks} onChange={handleNumStocksChange} autoComplete="off" />
                            </Form.Group>
                        </Form>
                        {showAlert && <p style={{ color: 'red' }}>Not enough money in wallet!</p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <p className="text-left">Total:{totalPrice}</p>
                        <Button variant="success" onClick={callBackend} type='submit' disabled={totalPrice > props?.currentBalance}>Buy</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        </>
    )
}