import { Row, Col, Card, Container } from 'react-bootstrap';
import { useState } from 'react';
import '../static/Tabs.css'

export default function Tabs() {
    const [toggle, setToggle] = useState(1);
    const [active, setActive] = useState(1);
    const newsItems = [
        { title: "If You Can Predict Cash Flow You Can Predict Stock Price - Austin Hankwitz", imageUrl: "https://hips.hearstapps.com/hbu.h-cdn.co/assets/16/43/2560x1706/gettyimages-513714175.jpg?resize=980:*" },
        { title: "11 Best Magic Formula Stocks to Buy Now", imageUrl: "https://hips.hearstapps.com/hbu.h-cdn.co/assets/16/43/2560x1706/gettyimages-513714175.jpg?resize=980:*" },
        // ... other news items
    ];
    function updateToggle(id) {
        setToggle(id);
        setActive(id)
    }


    return (
        <>
            <div className="p-5 tab">
                <ul className="d-flex">
                    <li className="flex-fill" onClick={() => updateToggle(1)}>Summary</li>
                    <li className="flex-fill" onClick={() => updateToggle(2)}>Top News</li>
                    <li className="flex-fill" onClick={() => updateToggle(3)}>Charts</li>
                    <li className="flex-fill" onClick={() => updateToggle(4)}>Insights</li>
                </ul>

                {/* SUMMARY TAB */}
                <div className={toggle === 1 ? "show-content" : "content"}>
                    <div className="d-flex flex-row">
                        <div className="p-2 flex-fill">
                            <b>High Price: </b> 78.32 <br />
                            <b>Low Price: </b> 78.32 <br />
                            <b>Open Price: </b> 78.32 <br />
                            <b>Prev Price: </b> 78.32 <br /> <br /> <br />
                            <div style={{ textAlign: 'center' }}>
                                <b><u>About the company</u></b> <br /> <br />
                                <b>IPO Start Date: </b> 2023-90-56 <br />
                                <b>Industry: </b> Technology <br />
                                <b>Webpage: </b> <a href="#">https://www.com</a><br />
                                <b>Company peers:</b> <br />
                            </div>

                        </div>
                        <div className="p-2 flex-fill">
                            Graph
                        </div>

                    </div>
                </div>

                {/* NEWS TAB */}
                <div className={toggle === 2 ? "show-content" : "content"}>
                    <div className="d-flex flex-row">
                        <div className="flex-fill ">
                            <Container>
                                <Row xs={1} md={3} className="g-4">
                                    {newsItems.map((item, idx) => (
                                        <Col key={idx}>
                                            <Card>
                                                <Card.Img variant="top" src={item.imageUrl} />
                                                <Card.Body>
                                                    <Card.Title>{item.title}</Card.Title>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                            </Container>

                        </div>
                        <div className="flex-fill">
                            <Container>
                                <Row xs={1} md={3} className="g-4">
                                    {newsItems.map((item, idx) => (
                                        <Col key={idx}>
                                            <Card>
                                                <Card.Img variant="top" src={item.imageUrl} />
                                                <Card.Body>
                                                    <Card.Title>{item.title}</Card.Title>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Container>
                        </div>

                    </div>

                </div>



                {/* CHARTS TAB */}
                <div className={toggle === 3 ? "show-content" : "content"}>
                    charts here
                </div>

                {/* INSIGHTS TAB */}
                <div className={toggle === 4 ? "show-content" : "content"}>
                    insights here
                </div>
            </div>
        </>
    )
}
