import {withRouter} from "react-router-dom";
import React, {Component} from 'react'
import "./index.less";
import $ from "jquery";
import ReactEcharts from "echarts-for-react";
import Super from "../../super";

class TestDataTj extends Component{
    state={menuId:17,legendData:[],xAxisData:[],series:[],日期:68,年:74,月:72,月度周:69,日:71,报警类型:73,数量:75}

    componentDidMount() {
        $("html").css("background-color","#fff");
        this.request();
    }
    request=()=>{
        this.initListByMenuId(false);
    }
    initListByMenuId=(reload)=>{
        Super.super({
            url:`api2/entity/${this.state.menuId}/list/tmpl`,
            method:'GET',
            query:{disabledColIds:"",criteria_13:"2019-05-20~2020-06-20"}
        }).then((res) => {
            console.log(res);
            if(!reload){//这里是初始化报警类型，只有在首次加载页面的时候初始化一次就行
                res.ltmpl.criterias.map((item,index)=>{
                    if(item.id==6){
                        this.initlegendData(item.fieldId);
                    }
                });
            }
            this.initListByQueryKey(res.queryKey);
        })
    }
    initListByQueryKey=(queryKey)=>{
        Super.super({
            url:`api2/entity/list/${queryKey}/data`,
            method:'GET',
        }).then((res) => {
            console.log("==="+JSON.stringify(res));
            this.initXAxisData(res);
        })
    }
    initlegendData=(fieldId)=>{
        Super.super({
            url:`api2/meta/dict/field_options`,
            method:'GET',
            query: {fieldIds:fieldId}
        }).then((res) => {
            console.log(res.optionsMap[fieldId]);
            let ldMap=[];
            let series=[];
            res.optionsMap[fieldId].map((item,index)=>{
                ldMap.push(item.title);
                series.push({name:item.title,type:'bar',data:[],barGap:0});
            });
            this.setState({legendData:ldMap});
            this.setState({series:series});
        })
    }
    initXAxisData=(res)=>{
        let xAxisData=[];
        res.entities.map((item,index)=>{
            let cellMap=item.cellMap;
            //console.log(cellMap);
            xAxisData.push(cellMap[this.state.日期]);
            this.state.series.map((sItem,sIndex)=>{
                if(cellMap[this.state.报警类型]==sItem.name){
                    sItem.data.push(cellMap[this.state.数量]);
                }
            });
        });
        //console.log(this.state.series);
        this.setState({xAxisData:xAxisData});
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
                data:this.state.legendData
            },
            xAxis:{
                //data:['周一','周二','周三','周四','周五','周六','周日']
                data:this.state.xAxisData,
                axisLabel: {
                    interval:0,
                    rotate:90
                }
            },
            yAxis:{
                type:'value'
            },
            series:this.state.series
                /*
                [
                {
                    name:'人员一键紧急报警',
                    type:'bar',
                    data:[1000,2000,1500,3000,2000,1200,800],
                    barGap:0
                },
                {
                    name:'车间缺员报警',
                    type:'bar',
                    data:[1000,2000,1500,3000,2000,1200,800],
                    barGap:0
                }
            ]
                 */
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
            <div>
                <button>日</button>
                <button>周</button>
                <button>月</button>
            </div>
            <ReactEcharts option={this.getOption()}/>
        </div>;
    }
}

export default withRouter(TestDataTj)