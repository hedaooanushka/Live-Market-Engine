import SmallChart from "./SmallChart"

export default function Summary(props) {
    let xaxis = []
    const data = props?.summary_chart;
    if (data) {
        return <></>;
    }
    console.log(data)
    for(let i=0; i<data.length; i++){
        xaxis.push(data[i].c)
    }
    let options = {
        title: {
            text: 'Hourly Price Variation'
        },
        series: [{
            data: []
        }]
    }
    return (
        <div className={props.toggle === 1 ? "show-content" : "content"}>
            <div className="d-flex flex-row ms-5">
                <div className="col-6">
                    <div className="pt-2 flex-fill">
                        <div className="container ps-5">
                            <b>High Price: </b> {props.data['High Price']}<br />
                            <b>Low Price: </b> {props.data['Low Price']} <br />
                            <b>Open Price: </b>{props.data['Open Price']} <br />
                            <b>Prev Price: </b>{props.data['Prev Price']} <br /> <br /> <br />
                        </div>
                        <div style={{ textAlign: 'center' }} className="container">
                            <b><u>About the company</u></b> <br /> <br />
                            <b>IPO Start Date: </b> {props.data['IPO Start Date']} <br />
                            <b>Industry: </b> {props.data['Industry']} <br />
                            <b>Webpage: </b> <a href="#">{props.data['Webpage']}</a><br />
                            <b>Company peers:</b>{props.data['Company peers']} <br />
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