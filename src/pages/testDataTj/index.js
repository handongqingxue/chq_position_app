import {withRouter} from "react-router-dom";
import React, {Component} from 'react'
import "./index.less";
import $ from "jquery";
import ReactEcharts from "echarts-for-react";

class TestDataTj extends Component{

    componentDidMount() {
        $("html").css("background-color","#fff");
    }
    getOption =()=> {
        let option = {
            tooltip:{   //展示数据
                trigger:'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend:{
                data:['aaa','bbb','ccc','ddd','eee','fff']
            },
            xAxis:{
                data:['周一','周二','周三','周四','周五','周六','周日']
            },
            yAxis:{
                type:'value'
            },
            series:[
                {
                    name:'aaa',
                    type:'bar',
                    data:[1000,2000,1500,3000,2000,1200,800],
                    barGap:0
                },
                {
                    name:'bbb',
                    type:'bar',
                    data:[1000,2000,1500,3000,2000,1200,800]
                },
                {
                    name:'ccc',
                    type:'bar',
                    data:[1000,2000,1500,3000,2000,1200,800]
                },
                {
                    name:'ddd',
                    type:'bar',
                    data:[1000,2000,1500,3000,2000,1200,800]
                },
                {
                    name:'eee',
                    type:'bar',
                    data:[1000,2000,1500,3000,2000,1200,800]
                },
                {
                    name:'fff',
                    type:'bar',
                    data:[1000,2000,1500,3000,2000,1200,800]
                }
            ]
        }
        return option;
    }
    goPage=(value)=>{
        this.props.history.push(`/${value}`);
    }

    render() {
        return <div className="bjInfoPage_div">
            <div className="top_div">报警统计</div>
            <div className="back_but_div" onClick={this.goPage.bind(this,'testHome')}>&lt;返回</div>
            <ReactEcharts option={this.getOption()}/>
        </div>;
    }
}

export default withRouter(TestDataTj)