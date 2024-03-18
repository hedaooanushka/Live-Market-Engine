import { Form, Container } from 'react-bootstrap';
import Tabs from './Tabs';
import CompanyInfo from './CompanyInfo';
import { useState, useEffect } from 'react';
import axios from 'axios';







export default function Search() {
    const [ticker_name, setTickerName] = useState("default");
    const [summary_info, setSummaryInfo] = useState("default");
    const [summary_chart, setSummaryChart] = useState({ results: [] });
    const [news_info, setNewsInfo] = useState([]);
    const [charts_info, setChartsInfo] = useState({ results: [] });
    const [insights_info, setInsightsInfo] = useState({ results: [] });



    var callBackend = () => {
        if (ticker_name !== "default") {
            // console.log("go backkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
            axios.get(`http://localhost:3000/summary?ticker_name=${ticker_name}`)
                .then(response => {
                    setSummaryInfo(response.data);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
            axios.get(`http://localhost:3000/news?ticker_name=${ticker_name}`)
                .then(response => {
                    setNewsInfo(response.data);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
            axios.get(`http://localhost:3000/summary-charts?ticker_name=${ticker_name}`)
                .then(response => {
                    // console.log("############################")
                    // console.log(response.data);
                    setSummaryChart(response.data);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
            axios.get(`http://localhost:3000/charts?ticker_name=${ticker_name}`)
                .then(response => {
                    // console.log("############################")
                    // console.log(JSON.stringify(response.data));
                    setChartsInfo(response.data);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
            axios.get(`http://localhost:3000/insights?ticker_name=${ticker_name}`)
                .then(response => {
                    console.log("############################")
                    console.log(response.data);
                    setInsightsInfo(response.data);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
        }
    }

    var handleInputChange = (event) => {
        setTickerName(event.target.value);
    }

    useEffect(() => {
        // console.log("##########")
        // console.log(summary_chart);
    }, [summary_chart]);

    useEffect(() => {
        callBackend();
    }, []);

    return (
        <>
            <br />
            <p style={{ textAlign: 'center', fontSize: '32px', fontFamily: 'sans-serif' }}>STOCK SEARCH</p>
            <br />
            <Container className="d-flex" style={{ borderRadius: '25px', border: 'blue solid 1px', padding: '6px', width: '33%' }}>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control onChange={handleInputChange} id="ticker_name" style={{ border: 'none' }} type="text" placeholder="Enter stock ticker symbol" />
                    </Form.Group>
                </Form>
                <svg type="button" onClick={callBackend} style={{ marginTop: '8px' }} className="ms-auto bi bi-search" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
                <svg type="button" style={{ marginTop: '8px' }} className="mx-3 bi bi-x-lg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
                {/* <br/><br/><br/><br/><br/><br/><br/>
                <p></p> */}
            </Container>
            <br />
            <CompanyInfo info={summary_info} />
            {/* <p>{company_info.peers}</p> */}
            <br />
            <Tabs info={summary_info} summary_chart={summary_chart} news={news_info} charts={charts_info} insights={insights_info} />
            {/* <Summary news={news_info}/> */}

        </>
    )
}

