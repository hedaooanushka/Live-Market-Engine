import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import IndicatorsCore from 'highcharts/indicators/indicators';
// import volumeByPrice from 'highcharts/indicators/volume-by-price'
import HighchartsVBP from 'highcharts/indicators/volume-by-price';
// import volumeByPrice from 'highcharts/modules/volume-by-price';
IndicatorsCore(Highcharts);
HighchartsVBP(Highcharts);
// volumeByPrice(Highcharts);
import '../static/Tabs.css'


export default function Charts(props) {

    const data = props?.charts?.results;
    let candlestick = [];
    let stockVolumeData = [];
    let options = {};
    if (!data) {
        return <></>;
    }
    // console.log(data)
    for (let i = 0; i < data.length; i++) {
        let temp = [];
        temp.push(data[i].t)
        temp.push(data[i].o)
        temp.push(data[i].h)
        temp.push(data[i].l)
        temp.push(data[i].c)
        stockVolumeData.push([data[i].t, data[i].v]);
        candlestick.push(temp)
    }
    // console.log(candlestick)
    if (candlestick.length > 0) {

        options = {
            chart: {
                height: 600, // Height of the chart in pixels
                backgroundColor: '#eee'
            },
            title: {
                text: `${props?.info?.profile?.ticker} Historical`
            },
            subtitle: {
                text: `With SMA and Volume by Price technical indicators`
            },
            plotOptions: {
                candlestick: {
                    color: 'blue',
                    lineColor: 'red',
                    upColor: 'lightgreen',
                    upLineColor: 'green',
                    pointWidth: 3,
                    groupPadding: 0.5,
                    borderWidth: 1
                },
                column: {
                    pointWidth: 5,
                    color: 'black',
                    borderColor: 'white',
                    borderWidth: 1
                }

            },

            rangeSelector: {
                selected: 1,
                buttons: [{
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3m'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m'
                }, {
                    type: 'ytd',
                    text: 'YTD'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1y'
                }, {
                    type: 'all',
                    text: 'All'
                }]
            },
            xAxis: {
                type: 'datetime',
                endOnTick: false,
                maxPadding: 0,
                offset: 40
            },
            yAxis: [{
                title: {
                    text: 'Stock Price'
                },
                labels: {
                          align: 'left',
                        //   x: -30
                        },
                        lineWidth: 2,
                height: '80%',
                resize: {
                    enabled: true
                },
            }, {
                labels: {
                    align: 'left',
                    x: -30
                  },
                  lineWidth:2,
                title: {
                    text: 'Volume'
                },
                opposite: true,
                // min: 0,
                height: '40%',
                top: '85%'
            }],
            legend: {
                enabled: true
            },
            // yAxis: [{
            //     labels: {
            //       align: 'right',
            //     //   x: -3
            //     },
            //     title: {
            //       text: 'OHLC'
            //     },
            //     height: '100%',
            //     lineWidth: 2,
            //     resize: {
            //       enabled: true
            //     }
            //   }, {
            //     labels: {
            //       align: 'right',
            //     //   x: -3
            //     },
            //     title: {
            //       text: 'Volume'
            //     },
            //     top: '71%',
            //     height: '50%',
            //     // offset: 0,
            //     lineWidth: 2
            //   }],
            //   tooltip: {
            //     split: true
            //   },

            series: [{
                type: 'candlestick',
                name: 'USD to EUR',
                data: candlestick,
                yAxis: 0,
                pointPlacement: 'on',
                id: 'candles'
            },
            {
                name: 'Volume',
                type: 'column',
                data: stockVolumeData,
                yAxis: 1,
                tooltip: {
                    valueDecimals: 0
                },
                pointPlacement: 'on',
                id:'volume'
            },
            {
                type: 'sma',
                linkedTo: 'candles',
                color: 'red'
            },
            {
                type: 'vbp',
                linkedTo: 'candles',
                params:{volumeSeriesId: 'volume'},
                showInLegend: false,
                dataLabels: {
                    enabled: false
                },
                zoneLines: {
                    enabled: false
                }
            }]
        }
    }



    return (
        <div className={props.toggle === 3 ? "show-content" : "content"}>
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={options}
            />
        </div>
    )
}