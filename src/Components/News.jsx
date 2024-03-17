import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import '../static/Tabs.css';

export default function News({ toggle, newsItems }) {
    let newsItemPairs = [];

    // Properly group news items into pairs
    if (newsItems) {
        for (let i = 0; i < newsItems.length; i += 2) {
            const pair = newsItems.slice(i, i + 2);
            if (pair.every(item => item.image !== "")) {
                newsItemPairs.push(pair);
            }
            if(newsItemPairs.length > 9) break
        }
    }

    // Render empty fragment if no pairs exist
    if (newsItemPairs.length === 0) {
        return <></>;
    }


    // Main component rendering
    return (
        <div className={toggle === 2 ? "show-content" : "content"}>
            <Container fluid className="m-2">
                {newsItemPairs.map((pair, index) => (
                    <Row className="mt-3" key={index}>
                        {pair.map((item, idx) => (
                            <Col md={6} key={idx}>
                                <Container fluid>
                                    <Row className="news p-3" type="button">
                                        <Col xs={4}>
                                            <img src={item.image} className="news-img" alt="" />
                                        </Col>
                                        <Col xs={8} className="mt-3">
                                            <Card.Title>{item.headline}</Card.Title>
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                        ))}
                    </Row>
                ))}
            </Container>
        </div>
    );
}
