import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
export default function SellModal(props) {
    if (!props?.showSellModal) {
        return <></>;
    }

    const [totalPrice, setTotalPrice] = useState(0)
    const [numStocks, setNumStocks] = useState(0)

    
    useEffect(() => {
        setTotalPrice(parseFloat(numStocks * props?.info?.latest_price?.c).toFixed(2));
    }, [numStocks]);

    const handleNumStocksChange = (e) => {
        const value = Number(e.target.value);
        setNumStocks(value);
        console.log(props.info)
    }

    
    return (
        <>
            {/* SELL MODAL */}
            <Modal show={props?.showSellModal} onHide={props?.toggleSellModal} dialogClassName="custom-modal">
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
                    </Modal.Body>
                    <Modal.Footer>
                        <p className="text-left">Total:{totalPrice}</p>
                        <Button variant="success">Sell</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        </>
    )
}