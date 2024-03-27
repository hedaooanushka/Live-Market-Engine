// import Navbar from 'react-bootstrap/Navbar';
// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import "../static/Tabs.css";

import { useState } from 'react';


export default function Headers(props) {
    const [activeTab, setActiveTab] = useState('home');
    const navbar = {
        backgroundColor: '#2424ab',
        // height: '45px',
        color: 'white'
    };
    const button = {
        backgroundColor: '#2424ab',
        color: 'white',
        textDecoration: 'none',
        border: 'none',
    };

    const activeButton = {
        backgroundColor: '#2424ab',
        border: '1px solid white',
        borderRadius: '12px',
        textDecoration: 'underline',
        color: 'white'
    };
    return (
        <>
            <Navbar style={navbar}>
                <Navbar.Brand className="mx-3" style={{ color: 'white' }}>Stock Search</Navbar.Brand>
                <Nav className="ms-auto px-3">
                    <div className="mx-1"><Button  className="navbutton" style={activeTab === 'home' ? activeButton : button} onClick={() => setActiveTab('home')}><Link to={{pathname: "/search/home",state: { myData: "Some data" }}} style={button}>Search</Link></Button></div>
                    <div className="mx-1"><Button className="navbutton" style={activeTab === 'watchlist' ? activeButton : button} onClick={() => setActiveTab('watchlist')}><Link to="/watchlist" style={button}>Watchlist</Link></Button></div>
                    <div className="mx-1"><Button className="navbutton" style={activeTab === 'portfolio' ? activeButton : button} onClick={() => setActiveTab('portfolio')}><Link to="/portfolio" style={button}>Portfolio</Link></Button></div>
                </Nav>
            </Navbar>
            {/* <Navbar collapseOnSelect expand="lg" style={navbar} variant="dark">
                <Navbar.Brand className="mx-3">Stock Search</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto px-3 flex-grow-1 justify-content-end">
                        <Nav.Link as={Link} to={{pathname: "/search/home",state: { myData: "Some data"}}} style={button} className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>
                            <Button>Search</Button>
                        </Nav.Link>
                        <Nav.Link as={Link} to="/watchlist" className={activeTab === 'watchlist' ? 'active' : ''} onClick={() => setActiveTab('watchlist')}>
                            Watchlist
                        </Nav.Link>
                        <Nav.Link as={Link} to="/portfolio" className={activeTab === 'portfolio' ? 'active' : ''} onClick={() => setActiveTab('portfolio')}>
                            Portfolio
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar> */}
        </>
    )
}