import {withRouter} from "react-router-dom";
import React, {Component} from 'react'
import "./index.less";
import $ from "jquery";
import BarReactEcharts from "echarts-for-react";
import PieReactEcharts from "echarts-for-react";
import { DatePicker, List } from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import Super from "../../super";
import * as moment from "moment";
import Text from "antd-mobile/es/text";

class TestDataTj extends Component{
    state={menuId:17,legendData:[],xAxisData:[],series:[],searchFlag:"",startDate:"",endDate:"",日期:68,月度周:69,日:71,月:72,报警类型:73,年:74,数量:75,日查询常量:"date",周查询常量:"week",月查询常量:"month",
        报警类型数据库里名称:{紧急报警:"人员一键紧急报警",缺员报警:"车间缺员报警",超员报警:"车间超员报警",串岗报警:"人员串岗报警",滞留报警:"人员滞留报警",静止报警:"人员长时间静止报警"},
        报警类型手机端显示名称:{紧急报警:"一键紧急报警",缺员超员报警:"车间缺员、超员报警",串岗滞留报警:"人员串岗、滞留报警",静止报警:"静止报警"},
        alignWithLabel:false,X轴字号:"",seriesNameList:[],seriesDataList:[],seriesColorList:[]}

    componentDidMount() {
        $("html").css("background-color","#F5F5F5");
        this.request();
    }
    request=()=>{
        this.initListByMenuId(this.state.日查询常量,false);
    }
    initListByMenuId=(flag,reload)=>{
        this.state.searchFlag=flag;
        let disabledColIds="";
        $("#but_div div").css("color","#000");
        $("#but_div div").css("border-bottom","#fff solid 1px");
        if(this.state.searchFlag==this.state.日查询常量){
            $("#but_div #date_but_div").css("color","#477A8F");
            $("#but_div #date_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds="";
            this.state.X轴字号=10;
            this.state.alignWithLabel=true;
        }
        else if(this.state.searchFlag==this.state.周查询常量){
            $("#but_div #week_but_div").css("color","#477A8F");
            $("#but_div #week_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds=this.state.日;
            this.state.X轴字号=9;
            this.state.alignWithLabel=false;
        }
        else if(this.state.searchFlag==this.state.月查询常量){
            $("#but_div #month_but_div").css("color","#477A8F");
            $("#but_div #month_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds=this.state.日+","+this.state.月度周;
            this.state.X轴字号=9;
            this.state.alignWithLabel=true;
        }
        Super.super({
            url:`api2/entity/${this.state.menuId}/list/tmpl`,
            method:'GET',
            query:{disabledColIds:disabledColIds,sortColIds:(68+"_ASC"),criteria_13:this.state.startDate+"~"+this.state.endDate}
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
            this.initXAxisData(res);
            this.initSeriesDataList();
            this.initYAxisData(res);
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
            let ldValueJj=null;
            let ldValueQc=null;
            let ldValueZc=null;
            let ldValueJz=null;
            let seriesNameList=this.state.seriesNameList;
            let seriesDataList=this.state.seriesDataList;
            let seriesColorList=this.state.seriesColorList;
            res.optionsMap[fieldId].map((item,index)=>{
                let 数据库里报警类型=this.state.报警类型数据库里名称;
                let 手机端报警类型=this.state.报警类型手机端显示名称;
                let color;
                switch (item.title) {
                    case 数据库里报警类型.紧急报警:
                        if(ldValueJj==null){
                            ldValueJj=手机端报警类型.紧急报警;
                            color="#F4552D";
                            seriesNameList.push(ldValueJj);
                            seriesDataList[ldValueJj]=[];
                            seriesColorList[ldValueJj]=color;
                            //series.push({name:ldValueJj,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueJj);
                        }
                        break;
                    case 数据库里报警类型.缺员报警:
                    case 数据库里报警类型.超员报警:
                        if(ldValueQc==null){
                            ldValueQc=手机端报警类型.缺员超员报警;
                            //console.log(手机端报警类型.缺员超员报警)
                            color="#FEA995";
                            seriesNameList.push(ldValueQc);
                            seriesDataList[ldValueQc]=[];
                            seriesColorList[ldValueQc]=color;
                            //series.push({name:ldValueQc,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueQc);
                        }
                        break;
                    case 数据库里报警类型.滞留报警:
                    case 数据库里报警类型.串岗报警:
                        if(ldValueZc==null){
                            ldValueZc=手机端报警类型.串岗滞留报警;
                            color="#1BAB3C";
                            seriesNameList.push(ldValueZc);
                            seriesDataList[ldValueZc]=[];
                            seriesColorList[ldValueZc]=color;
                            //series.push({name:ldValueZc,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueZc);
                        }
                        break;
                    case 数据库里报警类型.静止报警:
                        if(ldValueJz==null){
                            ldValueJz=手机端报警类型.静止报警;
                            color="#88D9A1";
                            seriesNameList.push(ldValueJz);
                            seriesDataList[ldValueJz]=[];
                            seriesColorList[ldValueJz]=color;
                            //series.push({name:ldValueJz,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueJz);
                        }
                        break;
                        /*
                    case 4:
                        color="#2191DB";
                        break;
                    case 5:
                        color="#9D9D9D";
                        break;
                         */
                }
            });
            this.setState({legendData:ldMap});
            //this.setState({series:series});
        })
    }
    initXAxisData=(res)=>{
        let xAxisData=[];
        res.entities.map((item,index)=>{
            let cellMap=item.cellMap;
            //console.log("cellMap==="+JSON.stringify(cellMap));
            if(this.state.searchFlag==this.state.日查询常量){
                if(!this.checkXAxisDataExist(xAxisData,cellMap[this.state.月]+"-"+cellMap[this.state.日])){
                    xAxisData.push(cellMap[this.state.月]+"-"+cellMap[this.state.日]);
                }
            }
            else if(this.state.searchFlag==this.state.周查询常量){
                let fxd=this.formatterXAxisData(cellMap,this.state.searchFlag)
                if(!this.checkXAxisDataExist(xAxisData,fxd))
                    xAxisData.push(fxd);
            }
            else if(this.state.searchFlag==this.state.月查询常量){
                if(!this.checkXAxisDataExist(xAxisData,cellMap[this.state.月]))
                    xAxisData.push(cellMap[this.state.月]);
            }
        });
        /*
        res.entities.map((item,index)=>{
            let cellMap=item.cellMap;
            //console.log("cellMap==="+JSON.stringify(cellMap));
            if(this.state.searchFlag==this.state.日查询常量)
                xAxisData.push(cellMap[this.state.月]+"-"+cellMap[this.state.日]);
            else if(this.state.searchFlag==this.state.周查询常量)
                xAxisData.push(cellMap[this.state.年]+"年"+cellMap[this.state.月]+"月"+cellMap[this.state.月度周]);
            else if(this.state.searchFlag==this.state.月查询常量)
                xAxisData.push(cellMap[this.state.年]+"年"+cellMap[this.state.月]+"月");
            let 数据库报警类型=this.state.报警类型数据库里名称;
            let 手机端报警类型=this.state.报警类型手机端显示名称;
            this.state.series.map((sItem,sIndex)=>{
                let 数报警类型=cellMap[this.state.报警类型];
                let 手报警类型;
                if(数据库报警类型.紧急报警==数报警类型)
                    手报警类型=手机端报警类型.紧急报警;
                else if(数据库报警类型.超员报警==数报警类型||数据库报警类型.缺员报警==数报警类型)
                    手报警类型=手机端报警类型.缺员超员报警;
                else if(数据库报警类型.串岗报警==数报警类型||数据库报警类型.滞留报警==数报警类型)
                    手报警类型=手机端报警类型.串岗滞留报警;
                else if(数据库报警类型.静止报警==数报警类型)
                    手报警类型=手机端报警类型.静止报警;

                if(手报警类型==sItem.name){
                    //console.log("报警时间==="+cellMap[this.state.日期])
                    console.log("报警时间==="+cellMap[this.state.日期]+",手报警类型==="+sItem.name+",数量==="+cellMap[this.state.数量])
                    sItem.data.push(cellMap[this.state.数量]);
                }
            });
        });
         */
        console.log("series==="+JSON.stringify(this.state.series));
        this.setState({xAxisData:xAxisData});
    }
    initYAxisData=(res)=>{
        console.log("==="+JSON.stringify(res));
        let series=[];
        let seriesData;
        res.entities.map((item,index)=>{
            let cellMap=item.cellMap;
            let 数据库报警类型=this.state.报警类型数据库里名称;
            let 手机端报警类型=this.state.报警类型手机端显示名称;
            let 数报警类型=cellMap[this.state.报警类型];
            let 手报警类型;
            if(数据库报警类型.紧急报警==数报警类型)
                手报警类型=手机端报警类型.紧急报警;
            else if(数据库报警类型.超员报警==数报警类型||数据库报警类型.缺员报警==数报警类型)
                手报警类型=手机端报警类型.缺员超员报警;
            else if(数据库报警类型.串岗报警==数报警类型||数据库报警类型.滞留报警==数报警类型)
                手报警类型=手机端报警类型.串岗滞留报警;
            else if(数据库报警类型.静止报警==数报警类型)
                手报警类型=手机端报警类型.静止报警;

            if(this.state.searchFlag==this.state.日查询常量){
                //console.log(cellMap[this.state.月]+"-"+cellMap[this.state.日]);
                this.state.seriesDataList[手报警类型].map((sdItem,sdIndex)=>{
                    if(sdItem.xLabel==cellMap[this.state.月]+"-"+cellMap[this.state.日]){
                        sdItem.yLabel=sdItem.yLabel+=parseInt(cellMap[this.state.数量]);
                    }
                });
            }
            else if(this.state.searchFlag==this.state.周查询常量){
                this.state.seriesDataList[手报警类型].map((sdItem,sdIndex)=>{
                    if(sdItem.xLabel==this.formatterXAxisData(cellMap,this.state.周查询常量)){
                        //console.log(sdItem.xLabel+","+cellMap[this.state.报警类型]+","+cellMap[this.state.数量])
                        sdItem.yLabel=sdItem.yLabel+=parseInt(cellMap[this.state.数量]);
                    }
                });
            }
            else if(this.state.searchFlag==this.state.月查询常量){
                this.state.seriesDataList[手报警类型].map((sdItem,sdIndex)=>{
                    if(sdItem.xLabel==cellMap[this.state.月]){
                        //console.log(sdItem.xLabel+","+cellMap[this.state.报警类型]+","+cellMap[this.state.数量])
                        sdItem.yLabel=sdItem.yLabel+=parseInt(cellMap[this.state.数量]);
                    }
                });
            }
            console.log(手报警类型+":"+JSON.stringify(this.state.seriesDataList[手报警类型]))//经测试没问题
        });

        this.state.legendData.map((item,index)=>{
            let data=[];
            this.state.seriesDataList[item].map((sdItem,sdIndex)=>{
                data.push(sdItem.yLabel);
            });
            series.push({name:item,type:'bar',data:data,barGap:0,itemStyle:{normal:{color:this.state.seriesColorList[item]}}});
        });
        this.setState({series:series});
    }
    initSeriesDataList=()=>{
        //先把上次加载的数据清空
        this.state.legendData.map((item,index)=>{
            this.state.seriesDataList[item]=[];
        });

        //清空上次加载的数据后，再加载新数据
        this.state.xAxisData.map((xItem)=>{
            this.state.legendData.map((legItem,index)=>{
                this.state.seriesDataList[legItem].push({"xLabel":xItem,"yLabel":0});
            });
        });
        console.log("---"+JSON.stringify(this.state.seriesDataList[this.state.报警类型手机端显示名称.缺员超员报警]))
    }
    checkXAxisDataExist=(xAxisData,xData)=>{
        let exist=false;
        xAxisData.map((item,index)=>{
            if(item==xData){
                exist=true;
                return exist;
            }
        });
        return exist;
    }
    formatterXAxisData=(cellMap,searchFlag)=>{
        let label;
        if(searchFlag==this.state.周查询常量){
            let date=cellMap[this.state.日期];
            let day=date.substring(8);
            if(day>=1&day<=7)
                label=cellMap[this.state.月]+".1-"+cellMap[this.state.月]+".7";
            else if(day>=8&day<=14)
                label=cellMap[this.state.月]+".8-"+cellMap[this.state.月]+".14";
            else if(day>=15&day<=21)
                label=cellMap[this.state.月]+".15-"+cellMap[this.state.月]+".21";
            else if(day>=22&day<=31){
                let month=date.substring(5,7);
                let lastDay;
                if(month==1||month==3||month==5||month==7||month==8||month==10||month==12)
                    lastDay=31;
                else if(month==2){
                    let year=date.substring(0,4);
                    if(year%4==0)
                        lastDay=29;
                    else
                        lastDay=28;
                }
                else
                    lastDay=30;
                label=cellMap[this.state.月]+".22-"+cellMap[this.state.月]+"."+lastDay;
            }
        }
        console.log("label==="+label)
        return label;
    }
    getBarOption =()=> {
        let option = {
            tooltip:{   //展示数据
                trigger:'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend:{
                itemWidth:10,
                itemHeight:10,
                x:'center',
                y: '15px',
                textStyle:{
                    fontSize:9
                },
                data:this.state.legendData
            },
            xAxis:{
                //data:['周一','周二','周三','周四','周五','周六','周日']
                data:this.state.xAxisData,
                axisTick:{alignWithLabel:this.state.alignWithLabel},
                axisLine:{
                    lineStyle:{
                        color:"#999",
                        width:0.5
                    }
                },
                axisLabel: {
                    fontSize:this.state.X轴字号,
                    interval:0
                    //rotate:45
                }
            },
            yAxis:{
                type:'value',
                minInterval: 1,
                axisLine:{
                    lineStyle:{
                        color:"#999",
                        width:0.5
                    }
                },
                axisLabel:{
                    fontSize:9
                },
                splitLine:{
                    lineStyle:{
                        color:"#ddd",
                        width:0.5
                    }
                }
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
    getPieOption=()=>{
        let option = {
            title: {
                text: '天气情况统计',
                subtext: '虚构数据',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                // orient: 'vertical',
                // top: 'middle',
                bottom: 10,
                left: 'center',
                data: ['西凉', '益州', '兖州', '荆州', '幽州']
            },
            series: [
                {
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    label: {
                        position: 'inner'
                    },
                    //roseType : 'area',
                    selectedMode: 'single',
                    data: [
                        {value: 1548,name: '幽州', selected: true},
                        {value: 535, name: '荆州'},
                        {value: 510, name: '兖州', selected: true},
                        {value: 634, name: '益州'},
                        {value: 735, name: '西凉', selected: true}
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        return option;
    }
    setDPDate=(flag,value)=>{
        if(flag=="start")
            this.state.startDate=moment(value).format('YYYY-MM-DD HH:mm:ss');
        else if(flag=="end")
            this.state.endDate=moment(value).format('YYYY-MM-DD HH:mm:ss');
    }
    getShowDate=(value)=>{
        let dateValue = moment(value).format("YYYY-MM");
        let tem = (
            <Text style={{fontSize:18}}>{dateValue}</Text>
        )
        return tem;
    }
    goPage=(value)=>{
        this.props.history.push(`/${value}`);
    }

    render() {
        const {日查询常量,周查询常量,月查询常量}=this.state
        return <div className="bjInfoPage_div">
            <div className="top_div">报警统计</div>
            <div className="back_but_div" onClick={this.goPage.bind(this,'testHome')}>&lt;返回</div>
            <div>
                <div className="jrbjtjsl_div">
                    <div className="jrbjsl_tit_div">今日报警</div>
                    <div className="count_list_div">
                        <div className="item_div">
                            <span className="text_span">人员长时间静止报警</span>
                            <span className="count_span">33</span>
                        </div>
                        <div className="item_div" style={{marginTop:'-30px',marginLeft:'200px'}}>
                            <div className="text_span">缺员报警</div>
                            <div className="count_span">3</div>
                        </div>
                        <div className="item_div" style={{marginTop:'0px',marginLeft:'0px'}}>
                            <div className="text_span">超员报警</div>
                            <div className="count_span">3</div>
                        </div>
                        <div className="item_div" style={{marginTop:'-30px',marginLeft:'200px'}}>
                            <div className="text_span">串岗报警</div>
                            <div className="count_span">3</div>
                        </div>
                    </div>
                </div>
                <div className="search_type_div">
                    <div className="but_div" id="but_div">
                        <div className="date_but_div" id="date_but_div" onClick={(e)=>this.initListByMenuId(日查询常量,true)}>日</div>
                        <div className="week_but_div" id="week_but_div" onClick={(e)=>this.initListByMenuId(周查询常量,true)}>周</div>
                        <div className="month_but_div" id="month_but_div" onClick={(e)=>this.initListByMenuId(月查询常量,true)}>月</div>
                    </div>
                </div>
                {/*<DatePicker*/}
                {/*    mode="date"*/}
                {/*    title="开始时间"*/}
                {/*    extra="开始时间"*/}
                {/*    value={this.state.date}*/}
                {/*    onChange={date => this.setDPDate('start',date)}*/}
                {/*>*/}
                {/*    <List.Item arrow="horizontal">2019-01-01</List.Item>*/}
                {/*</DatePicker>*/}
                {/*<DatePicker*/}
                {/*    mode="date"*/}
                {/*    title="结束时间"*/}
                {/*    extra="结束时间"*/}
                {/*    value={this.state.date}*/}
                {/*    onChange={date=>this.setDPDate('end',date)}*/}
                {/*>*/}
                {/*    <List.Item arrow="horizontal">2021-01-01</List.Item>*/}
                {/*</DatePicker>*/}
            </div>
            <div className="bar_div">
                <BarReactEcharts className="reactEcharts" id="echart" option={this.getBarOption()}/>
                <PieReactEcharts className="reactEcharts" id="echart" option={this.getPieOption()}/>
            </div>
            <div className="pie_div">
            </div>
        </div>;
    }
}

export default withRouter(TestDataTj)