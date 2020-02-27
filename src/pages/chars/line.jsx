import React from 'react'
import {Card,Button} from "antd"
import ReactEcharts from "echarts-for-react"

export default class Line extends React.Component {

    state = {
        sales:[5,20,36,10,10,20]
    }

    update = () =>{
        this.setState((state)=>({
            sales:state.sales.map(sale=>sale+1)
        }))
    }

    render(){
        const {sales} = this.state
        return (
            <div>
                <Card>
                    <Button type="primary" onClick={this.update}>更新</Button>
                </Card>
                <Card title='折线图-->'>
                    <ReactEcharts option={this.getOption(sales)} />
                </Card>
            </div>
        )
    }

    getOption = (sales) => {
        return {
            title:{
                text:'Echarts 入门'
            },
            tooltip:{},
            legend:{
                data:['销量']
            },
            xAxis:{
                data:['衬衫','羊毛伞','雪纺裤','裤子','高跟鞋','袜子']
            },
            yAxis:{},
            series:[{
                name:'销量',
                type:'line',
                data:sales
            }]
        }
    }
}