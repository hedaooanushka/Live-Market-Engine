// import Navbar from 'react-bootstrap/Navbar';
// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import '../static/Header.css'
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';


export default function Headers() {
    const [activeTab, setActiveTab] = useState('home');
    const location = useLocation();
    const navbar = {
        backgroundColor: '#2424ab',
        // height: '15px',
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
    
    useEffect(() => {
        const path = location.pathname;
        console.log('PPPPPPAAAAAAAAAAAAAATHHHHHHHHHHHHH =====', path)
        if (path === '/search/home') {
            setActiveTab('home');
        } else if (path === '/watchlist') {
            setActiveTab('watchlist');
        } else if (path === '/portfolio') {
            setActiveTab('portfolio');
        }
        else{
            setActiveTab('home');
        }
    }, [location, activeTab]);
     
  
    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="custom-navbar">
                <Navbar.Brand className="custom-brand" style={{paddingLeft: '1%'}}>Stock Search</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" className="custom-toggle" />
                <Navbar.Collapse id="responsive-navbar-nav" className="custom-collapse">
                    <Nav className="ms-auto">
                        <Nav.Link eventKey={1} onClick={() => setActiveTab('home')} className={`custom-link ${activeTab === 'home' ? 'text-primary' : 'text-secondary'}`}>
                            <Link to={{ pathname: "/search/home" }} className="text-white text-decoration-none">Search</Link>
                        </Nav.Link>
                        <Nav.Link eventKey={2} onClick={() => setActiveTab('watchlist')} className={`custom-link ${activeTab === 'watchlist' ? 'text-primary' : 'text-secondary'}`}>
                            <Link to="/watchlist" className="text-white text-decoration-none">Watchlist</Link>
                        </Nav.Link>
                        <Nav.Link eventKey={3} onClick={() => setActiveTab('portfolio')} className={`custom-link ${activeTab === 'portfolio' ? 'text-primary' : 'text-secondary'}`}>
                            <Link to="/portfolio" className="text-white text-decoration-none">Portfolio</Link>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
           
        </>
    )
}