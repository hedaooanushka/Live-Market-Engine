import '../static/Tabs.css'
import SmallChart from './SmallChart'
export default function Insights(props) {
    const options = {
        title: {
            text: 'My chart'
        },
        series: [{
            data: [1, 2, 3]
        }]
    }
    const tableData = {
        "company": "Apple",
        "Apple": {
            "Total": "-590",
            "Positive": "200",
            "Negative": "-790"
        },
        "MSPR": {
            "Total": "-245648",
            "Positive": "8985196",
            "Negative": "-456865"
        },
        "Change": {
            "Total": "-245058",
            "Positive": "8984996",
            "Negative": "-456075"
        }
    }
    return (
        <div className={props.toggle === 4 ? "show-content" : "content"}>
            <div className='container justify-content-center' style={{ textAlign: "center" }} >
                <h2>Insider Sentiments</h2> <br/>
                <table className="table table-responsive-sm ">
                    <thead>
                        <tr>
                            <th scope="col">{tableData["company"]}</th>
                            <th scope="col">MSPR</th>
                            <th scope="col">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Total</th>
                            <td>-590</td>
                            <td>-245648</td>
                        </tr>
                        <tr>
                            <th>Positvie</th>
                            <td>200</td>
                            <td>8985196</td>
                        </tr>
                        <tr>
                            <th> Negative</th>
                            <td >-790</td>
                            <td>-456865</td>
                        </tr>
                    </tbody>
                </table>
            </div><br/>
            <div className='container-fluid row justify-content-center'>
                <div className='col-5'>
                    <SmallChart data={options} />
                </div>
                <div className='col-5'>
                    <SmallChart data={options} />
                </div>
            </div>
        </div>
    )
}