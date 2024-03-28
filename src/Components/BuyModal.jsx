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

    const hide = (e) => {
        e.preventDefault();
        props.toggleBuyModal();
    }

    const callBackend = () => {
        axios.post('http://localhost:3000/buy', { price: totalPrice, quantity: numStocks, ticker: props?.ticker, company: props?.company })
            .then((res) => {
                props.toggleBuyModal();
                props.toggleBuyMessage()

            }).catch((err) => {
                console.log(err);
            })
    }

    return (
        <>
            {/* BUY MODAL */}

            <Modal show={props?.showBuyModal} onHide={props?.toggleBuyModal} className='my-modal' style={{top:'5px', marginLeft:'5px', marginRight:'5px'}}>
                <Modal.Dialog style={{ width: '100%', height: '100%' }}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{padding:'0px'}}>{props?.ticker}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p style={{lineHeight:'0.4'}}>Current Price: {props?.latest_price}</p>
                        <p style={{lineHeight:'0.4'}}>Money in wallet: ${props?.currentBalance.toFixed(2)}</p>
                        <Form>
                            <Form.Group className="mb-0 d-flex align-items-center" controlId="exampleForm.ControlInput1">
                                <Form.Label className="mb-0" style={{ marginRight: '10px',lineHeight:'0.4' }}>Quantity:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="No of stocks to buy"
                                    value={numStocks}
                                    onChange={handleNumStocksChange}
                                    autoComplete="off"
                                    style={{ flex: '1' }} // Take up remaining space
                                />
                            </Form.Group>
                        </Form>

                        {showAlert && <p style={{ color: 'red' }}>Not enough money in wallet!</p>}
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-between" style={{padding:'0px', paddingLeft:'12px'}}>
                        <p>Total: {totalPrice}</p>
                        <Button variant="success" onClick={callBackend} type='submit' disabled={totalPrice > props?.currentBalance}>Buy</Button>
                    </Modal.Footer>

                </Modal.Dialog>
            </Modal>
        </>
    )
}