import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import '../static/Tabs.css'
import {useState, useEffect} from 'react'

export default function BuyModal(props) {
    if (!props?.showBuyModal) {
        return <></>;
    }

    const [totalPrice, setTotalPrice] = useState(0)
    const [numStocks, setNumStocks] = useState(0)
    const [showAlert, setShowAlert] = useState(false);

    
    useEffect(() => {
        const currentPrice = parseFloat(numStocks * props?.info?.latest_price?.c).toFixed(2)
        setTotalPrice(currentPrice);
        if(currentPrice > props?.currentBalance){
            setShowAlert(true);
        }else setShowAlert(false);
    }, [numStocks]);

    const handleNumStocksChange = (e) => {
        const value = Number(e.target.value);
        setNumStocks(value);
        console.log(props.info)

    }

    const callBackend = () => {

    }

    return (
        <>
            {/* BUY MODAL */}
            <Modal show={props?.showBuyModal} onHide={props?.toggleBuyModal} dialogClassName="custom-modal">
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>{props?.info?.profile?.ticker}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Current Price: {props?.info?.latest_price?.c}</p>
                        <p>Money in wallet: ${props?.currentBalance}</p>
                        <p>Quantity: </p>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="text" placeholder="No of stocks to buy" value={numStocks} onChange={handleNumStocksChange} autoComplete="off"/>
                            </Form.Group>
                        </Form>
                        {showAlert && <p style={{color: 'red'}}>Not enough money in wallet!</p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <p className="text-left">Total:{totalPrice}</p>
                        <Button variant="success">Buy</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        </>
    )
}