import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Row';
import {Link} from 'react-router-dom';




export default function Headers(props) {
    const navbar = {
        backgroundColor: '#2424ab',
        height: '45px',
        color: 'white'
    };
    const button = {
        backgroundColor: '#2424ab',
        border: '1px solid white',
        borderRadius: '12px',
        color: 'white'
    };
    return (
        <>
            <Navbar style={navbar}>
                <Navbar.Brand className="mx-3" style={{ color: 'white' }}>Stock Search</Navbar.Brand>
                {/* ms=left margin */}
                <Nav className="ms-auto px-3"> 
                    <div className="mx-1"><Button style={button}><Link to="/search/home">Home</Link></Button></div>
                    <div className="mx-1"><Button style={button}><Link to="/watchlist">Watchlist</Link></Button></div>
                    <div className="mx-1"><Button style={button}><Link to="/portfolio">Portfolio</Link></Button></div>
                </Nav>
            </Navbar>
        </>
    )
}