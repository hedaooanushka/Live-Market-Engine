import { Row, Col, Card, Container } from 'react-bootstrap';
import { useState } from 'react';
import '../static/Tabs.css'
import News from './News';
import Insights from './Insights';
import Summary from './Summary';
import Charts from './Charts';
export default function Tabs(props) {
    if(props?.ticker_name === "default" || props?.isValid === false || props.hide){
        return(
            <></>
        )
    }
  
    const [toggle, setToggle] = useState(1);
    const [active, setActive] = useState(1);
    const newsItems = props.news;
    // const summaryData = {
    //     'High Price': '78.32',
    //     'Low Price': '78.32',
    //     'Open Price': '78.32',
    //     'Prev Price': '78.32',
    //     'IPO Start Date': '2023-90-56',
    //     'Industry': 'Technology',
    //     'Webpage': 'https://www.com',
    //     'Company peers': ['Dell', 'HP', 'Apple', 'Microsoft']
    // }


    // const options = {
    //     title: {
    //         text: 'My chart'
    //     },
    //     series: [{
    //         data: [1, 2, 3]
    //     }]
    // }
    function updateToggle(id) {
        setToggle(id);
        setActive(id)
    }


    return (
        <>
            <div className="p-5 tab">
                <ul className="container-fluid row justify-content-center">
                    <li className="col-3" onClick={() => updateToggle(1)}>Summary</li>
                    <li className="col-3" onClick={() => updateToggle(2)}>Top News</li>
                    <li className="col-3" onClick={() => updateToggle(3)}>Charts</li>
                    <li className="col-3" onClick={() => updateToggle(4)}>Insights</li>
                </ul>

                {/* SUMMARY TAB */}
                <Summary toggle={toggle} info={props.info} summary_chart = {props.summary_chart}/>

                {/* NEWS TAB */}
                <News toggle={toggle} newsItems={newsItems} />



                {/* CHARTS TAB */}
                <Charts toggle={toggle} data={props.summary_chart} charts={props.charts} info={props.info}/>

                {/* INSIGHTS TAB */}
                <Insights toggle={toggle} insights={props.insights} info={props.info}/>
            </div>
        </>
    )
}