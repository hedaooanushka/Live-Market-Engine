import { Row, Col, Card, Container } from 'react-bootstrap';
import { useState } from 'react';
// import '../static/Tabs.css'
import News from './News';
import Insights from './Insights';
import Summary from './Summary';
import Charts from './Charts';
export default function Tabs(props) {
    if (props?.ticker_name === "default" || props?.isValid === false || props.hide) {
        return (
            <></>
        )
    }

    const [toggle, setToggle] = useState(1);
    const [active, setActive] = useState(1);
    const newsItems = props.news;
    function updateToggle(id) {
        setToggle(id);
        setActive(id)
    }

    return (
        <>
            <div className="tab">
                <ul className="container-fluid row justify-content-center" style={{marginLeft:'0px'}}>
                    <ul className="container-fluid row justify-content-center">
                        <li className="col-3" onClick={() => updateToggle(1)} style={{ borderBottom: toggle === 1 ? '2px solid #0000ff' : 'none', color: toggle === 1 ? '#0000ff' : 'currentcolor' }}>Summary</li>
                        <li className="col-3" onClick={() => updateToggle(2)} style={{ borderBottom: toggle === 2 ? '2px solid #0000ff' : 'none', color: toggle === 2 ? '#0000ff' : 'currentcolor' }}>Top News</li>
                        <li className="col-3" onClick={() => updateToggle(3)} style={{ borderBottom: toggle === 3 ? '2px solid #0000ff' : 'none', color: toggle === 3 ? '#0000ff' : 'currentcolor' }}>Charts</li>
                        <li className="col-3" onClick={() => updateToggle(4)} style={{ borderBottom: toggle === 4 ? '2px solid #0000ff' : 'none', color: toggle === 4 ? '#0000ff' : 'currentcolor' }}>Insights</li>
                    </ul>
                </ul>

                {/* SUMMARY TAB */}
                <Summary toggle={toggle} info={props.info} summary_chart={props.summary_chart} last={props?.last} now={props?.now} isMarketOpen={props?.isMarketOpen} />

                {/* NEWS TAB */}
                <News toggle={toggle} newsItems={newsItems} />



                {/* CHARTS TAB */}
                <Charts toggle={toggle} data={props.summary_chart} charts={props.charts} info={props.info} ticker_name={props?.ticker_name} />

                {/* INSIGHTS TAB */}
                <Insights toggle={toggle} insights={props.insights} info={props.info} />
            </div>
        </>
    )
}