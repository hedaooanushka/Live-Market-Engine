import { Card, Col, Container, Row } from 'react-bootstrap';
import '../static/Tabs.css'

export default function News(props) {
    // Group news items into pairs
    const newsItemPairs = [];
    for (let i = 0; i < props.newsItems.length; i += 2) {
        newsItemPairs.push(props.newsItems.slice(i, i + 2));
    }

    return (
        <div className={props.toggle === 2 ? "show-content" : "content"}>
            <div className='container-fluid flex-d m-2'>
                {newsItemPairs.map((pair, index) => {
                    return (
                        <Row className='mt-3' key={index}>
                            {pair.map((item, index) => (
                                <Col md={6} key={index}>
                                    <div className='container-fluid'>
                                        <Row className='news p-3' type='button'>
                                            <Col xs={4}>
                                                <img src={item.imageUrl} className='news-img'></img>
                                            </Col>
                                            <Col xs={8} className='mt-3'>
                                                <Card.Title>{item.title}</Card.Title>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    );
                })}
            </div>
        </div>
    );
}