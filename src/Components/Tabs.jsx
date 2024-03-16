import { Row, Col, Card, Container } from 'react-bootstrap';
import { useState } from 'react';
import '../static/Tabs.css'
import News from './News';
import Insights from './Insights';
import Summary from './Summary';
import Charts from './Charts';
export default function Tabs() {
    const [toggle, setToggle] = useState(1);
    const [active, setActive] = useState(1);
    const newsItems = [
        { title: "If You Can Predict Cash Flow You Can Predict Stock Price - Austin Hankwitz", imageUrl: "https://hips.hearstapps.com/hbu.h-cdn.co/assets/16/43/2560x1706/gettyimages-513714175.jpg?resize=980:*" },
        { title: "11 Best Magic Formula Stocks to Buy Now", imageUrl: "https://hips.hearstapps.com/hbu.h-cdn.co/assets/16/43/2560x1706/gettyimages-513714175.jpg?resize=980:*" },
        { title: "IPL starts from 22nd-March-2024", imageUrl: "https://hips.hearstapps.com/hbu.h-cdn.co/assets/16/43/2560x1706/gettyimages-513714175.jpg?resize=980:*" },
        { title: "Assignment deadline is also 22nd-March-2024", imageUrl: "https://hips.hearstapps.com/hbu.h-cdn.co/assets/16/43/2560x1706/gettyimages-513714175.jpg?resize=980:*" },
        { title: "I was reading books of old some lengends and some myths", imageUrl: "https://hips.hearstapps.com/hbu.h-cdn.co/assets/16/43/2560x1706/gettyimages-513714175.jpg?resize=980:*" },
        { title: "Broo is the BEST", imageUrl: "https://hips.hearstapps.com/hbu.h-cdn.co/assets/16/43/2560x1706/gettyimages-513714175.jpg?resize=980:*" },
        // ... other news items
    ];
    const summaryData = {
        'High Price': '78.32',
        'Low Price': '78.32',
        'Open Price': '78.32',
        'Prev Price': '78.32',
        'IPO Start Date': '2023-90-56',
        'Industry': 'Technology',
        'Webpage': 'https://www.com',
        'Company peers': ['Dell', 'HP', 'Apple', 'Microsoft']
    }
    const options = {
        title: {
            text: 'My chart'
        },
        series: [{
            data: [1, 2, 3]
        }]
    }
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
                <Summary toggle={toggle} data={summaryData} />

                {/* NEWS TAB */}
                <News toggle={toggle} newsItems={newsItems} />



                {/* CHARTS TAB */}
                <Charts toggle={toggle} data={options}/>

                {/* INSIGHTS TAB */}
                <Insights toggle={toggle}/>
            </div>
        </>
    )
}