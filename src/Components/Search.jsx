import { Form, Container } from 'react-bootstrap';


export default function Search() {
    return (
        <>
            <br />
            <p style={{ textAlign: 'center', fontSize: '32px', fontFamily: 'sans-serif' }}>STOCK SEARCH</p>
            <br />
            <Container className="d-flex" style={{ borderRadius: '25px', border: 'blue solid 1px', padding: '6px', width: '33%' }}>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control style={{ border: 'none' }} type="text" placeholder="Enter stock ticker symbol" />
                    </Form.Group>
                </Form>
                <svg type="button" style={{ marginTop: '8px' }} className="ms-auto bi bi-search" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
                <svg type="button" style={{ marginTop: '8px' }} className="mx-3 bi bi-x-lg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>


            </Container>

        </>
    )
}