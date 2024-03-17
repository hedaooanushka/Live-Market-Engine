import { Container, Row, Col, Button } from 'react-bootstrap';
import '../static/Tabs.css'

export default function CompanyInfo(props) {
    return (
        <>
            <div className="d-flex flex-row bd-highlight mx-auto" style={{ textAlign: 'center', justifyContent: 'space-around', width:'80%' }}>
                <div className="p-2 bd-highlight">
                    <p><span style={{fontSize: '32px', fontWeight: 'bold'}}>{props?.info?.profile?.ticker}</span>
                        <svg className="ms-2 mb-4 bi bi-star m-1" type="button" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                        </svg>
                        <br/><span style={{fontSize: '20px', fontWeight:"bold", color:'grey'}}></span>{props?.info?.profile?.name} <br />
                        <span style={{color: 'gray', fontSize: '15px'}}>{props?.info?.profile?.exchange} </span>
                    </p>
                    <Button className='me-2' variant="success">Buy</Button>{' '}
                    <Button variant="danger">Sell</Button>{' '}
                </div>
                <div className="pt-4 pe-5 bd-highlight">
                    <img src="https://i.pinimg.com/originals/3a/80/d0/3a80d08597eb583fc0784a694b56169a.jpg" style={{maxwidth: '120px', maxHeight:'120px'}}></img>
                </div>
                <div className="p-2 pe-5 bd-highlight">
                    <span style={{fontSize: '20px', fontWeight: 'bold'}}>88.75</span> <br/>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                    </svg>
                    <span style={{fontSize: '17px'}}>7.36 (9.04%)</span> <br/>
                    <span style={{fontSize: '13px'}}> 2024-09-78 12:45:12</span>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                    </svg> */}
                </div>

            </div>
        </>
    )
}