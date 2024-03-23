import SmallChart from "./SmallChart"
// import { useState } from 'react-router-dom';
// import Search, { callBackend } from '../Components/Search';
// import Search from '../Components/Search.jsx';
import Search from './Search.jsx';
import {  useState } from "react";
import { useNavigate } from 'react-router-dom';
// import Search from '../Components/Search.jsx';



export default function Summary(props) {
    // put level by level check
    if (!props.info.peers) {
        return (
            <></>
        )
    }

    // COMPANY PEERS
    // const navigate = useNavigate();
    // const baseURL = `http://localhost:5173/search/`;
    const [selectedCompany, setSelectedCompany] = useState(null);
    const navigate = useNavigate();
    const handleClick = (company) => {
        console.log("handling different company");
        console.log(company);
        // Update the state to the clicked company
        navigate(`/search/${company}`);
        setSelectedCompany(company);
    };

    // const handleClick = (company) => {
    //     console.log("handling different company");
    //     console.log(company);
    //     return (<Search ticker_name={company}/>)
    // };



    // SUMMARY-CHARTS
    let xaxis = []
    const data = props?.summary_chart?.results;
    if (!data) {
        return <></>;
    }
    for (let i = 0; i < data.length; i++) {
        xaxis.push(data[i].c)
    }
    let options = {
        title: {
            text: 'Hourly Price Variation'
        },
        series: [{
            data: xaxis,
            type: 'spline'
        }]
    }
    return (
        <div className={props.toggle === 1 ? "show-content" : "content"}>
            <div className="d-flex flex-row ms-5">
                <div className="col-6">
                    <div className="pt-2 flex-fill">
                        <div className="container ps-5">
                            <b>High Price: </b> {props?.info?.latest_price?.h}<br />
                            <b>Low Price: </b> {props?.info?.latest_price?.l} <br />
                            <b>Open Price: </b>{props?.info?.latest_price?.o} <br />
                            <b>Prev Price: </b>{props?.info?.latest_price?.pc} <br /> <br /> <br />
                        </div>
                        <div style={{ textAlign: 'center' }} className="container">
                            <b><u>About the company</u></b> <br /> <br />
                            <b>IPO Start Date: </b> {props?.info?.profile?.ipo} <br />
                            <b>Industry: </b> {props?.info?.profile?.finnhubIndustry} <br />
                            <b>Webpage: </b> <a href={props?.info?.profile?.weburl}>{props?.info?.profile?.weburl}</a><br />
                            <b>Company peers</b>
                            {/* <div>
                                {props?.info?.peers.map((company, index) => (
                                    <span>
                                        <a href={`${baseURL}${company}`}>{company} </a>,
                                    </span>
                                ))}
                            </div> */}
                            <div>
                                {props?.info?.peers.map((company, index) => (
                                    <span key={index}>
                                        <button onClick={() => handleClick(company)} style={{ textDecoration: 'underline', color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            {company}
                                        </button>,
                                    </span>
                                ))}
                            </div>
                            {/* {selectedCompany && <Search ticker_name={selectedCompany} />} */}
                        </div>
                    </div>

                </div>
                <div className="col-6">

                    <SmallChart data={options} />

                </div>
            </div>

        </div>

    )
}