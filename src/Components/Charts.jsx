import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import '../static/Tabs.css'

export default function Charts(props) {
    
    return (
        <div className={props.toggle === 3  ? "show-content" : "content"}>
            <HighchartsReact
                highcharts={Highcharts}
                options={props.data}
            />
        </div>
    )
}