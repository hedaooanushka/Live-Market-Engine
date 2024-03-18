import '../static/Tabs.css'
import SmallChart from './SmallChart'
export default function Insights(props) {
    const data = props.insights.data;
    let mspr_total = 0;
    let mspr_positive = 0;
    let mspr_negative = 0;
    let change_total = 0;
    let change_positive = 0;
    let change_negative = 0;
    if(!data){
        return(
            <></>
        )
    }

    for(let i=0; i<data.length; i++){
        if(data[i]?.mspr >= 0){
            mspr_positive += data[i]?.mspr;
        }else if(data[i]?.mspr < 0){
            mspr_negative += data[i]?.mspr;
        }
        if(data[i]?.change < 0){
            change_negative += data[i]?.change;
        }else{
            change_positive += data[i]?.change;
        }
        change_total += data[i]?.change;
        mspr_total += data[i]?.mspr;
    }
    console.log(mspr_total);
    console.log(mspr_positive);
    console.log(mspr_negative);




    const options = {
        title: {
            text: 'My chart'
        },
        series: [{
            data: [1, 2, 3]
        }]
    }
    return (
        <div className={props.toggle === 4 ? "show-content" : "content"}>
            <div className='container justify-content-center' style={{ textAlign: "center" }} >
                <h2>Insider Sentiments</h2> <br/>
                <table className="table table-responsive-sm ">
                    <thead>
                        <tr>
                            <th scope="col">{props?.info?.profile?.name}</th>
                            <th scope="col">MSPR</th>
                            <th scope="col">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Total</th>
                            <td>{mspr_total}</td>
                            <td>{change_total}</td>
                        </tr>
                        <tr>
                            <th>Positvie</th>
                            <td>{mspr_positive}</td>
                            <td>{change_positive}</td>
                        </tr>
                        <tr>
                            <th> Negative</th>
                            <td >{mspr_negative}</td>
                            <td> {change_negative}</td>
                        </tr>
                    </tbody>
                </table>
            </div><br/>
            {/* <div className='container-fluid row justify-content-center'>
                <div className='col-5'>
                    <SmallChart data={options} />
                </div>
                <div className='col-5'>
                    <SmallChart data={options} />
                </div>
            </div> */}
        </div>
    )
}