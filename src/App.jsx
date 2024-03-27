import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Headers from './Components/Headers.jsx';
import Search from './Components/Search.jsx';
import Footer from './Components/Footers.jsx';
import Watchlist from './Components/Watchlist.jsx';
import Portfolio from './Components/Portfolio.jsx';
import './App.css'
// Import other components as needed

function RedirectToSearchHome() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/search/home');
  }, [navigate]);
  return null; // Or a loading indicator
}

function App() {
  return (
    <>
      <Router>
        <Headers />
        <br />
        <Routes>
          <Route path="/" element={<RedirectToSearchHome />} />
          <Route path="/search/home" element={<Search ticker_name=""/>} />
          <Route path="/search/:ticker" element={<Search ticker_name="" />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
