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
    state={menuId:17,barLegendData:[],pieLegendData:[],xAxisData:[],series:[],barSearchFlag:"",pieSearchFlag:"",barStartDate:"",barEndDate:"",
        报警围栏:96488543625218,
        日期:96488543625219,
        月度周:96488543625225,
        日:96488543625223,
        月:96488543625221,
        报警类型:96488543625224,
        年:96488543625221,
        数量:96488543625225,
        日查询常量:"date",周查询常量:"week",月查询常量:"month",三个月查询常量:"three_month",
        报警类型数据库里名称:{紧急报警:"人员一键紧急报警",缺员报警:"车间缺员报警",超员报警:"车间超员报警",串岗报警:"人员串岗报警",滞留报警:"人员滞留报警",静止报警:"人员长时间静止报警"},
        报警类型手机端显示名称:{紧急报警:"一键紧急报警",缺员超员报警:"车间缺员、超员报警",串岗滞留报警:"人员串岗、滞留报警",静止报警:"静止报警"},
        alignWithLabel:false,X轴字号:"",barSeriesNameList:[],barSeriesDataList:[],barSeriesColorList:[],todayBjCountList:[],bjqyList:[],pieSeriesDataList:[]}

    componentDidMount() {
        $("html").css("background-color","#F5F5F5");
        this.request();
    }
    request=()=>{
        this.initBarListByMenuId(this.state.日查询常量,false);
        this.initPieListByMenuId(this.state.日查询常量,false);
    }
    initBarListByMenuId=(flag,reload)=>{
        this.state.barSearchFlag=flag;
        let disabledColIds="";
        $("#bar_search_type_div #but_div div").css("color","#000");
        $("#bar_search_type_div #but_div div").css("border-bottom","#fff solid 1px");
        if(this.state.barSearchFlag==this.state.日查询常量){
            $("#bar_search_type_div #date_but_div").css("color","#477A8F");
            $("#bar_search_type_div #date_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds="";
            this.state.X轴字号=10;
            this.state.alignWithLabel=true;
        }
        else if(this.state.barSearchFlag==this.state.周查询常量){
            $("#bar_search_type_div #week_but_div").css("color","#477A8F");
            $("#bar_search_type_div #week_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds=this.state.日;
            this.state.X轴字号=9;
            this.state.alignWithLabel=false;
        }
        else if(this.state.barSearchFlag==this.state.月查询常量){
            $("#bar_search_type_div #month_but_div").css("color","#477A8F");
            $("#bar_search_type_div #month_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds=this.state.日+","+this.state.月度周;
            this.state.X轴字号=9;
            this.state.alignWithLabel=true;
        }
        Super.super({
            url:`api2/entity/${this.state.menuId}/list/tmpl`,
            method:'GET',
            query:{disabledColIds:disabledColIds,sortColIds:(68+"_ASC"),criteria_13:this.state.barStartDate+"~"+this.state.barEndDate}
        }).then((res) => {
            console.log(res);
            if(!reload){//这里是初始化报警类型，只有在首次加载页面的时候初始化一次就行
                res.ltmpl.criterias.map((item,index)=>{
                    if(item.id==6){
                        this.initBarlegendData(item.fieldId);
                    }
                });
            }
            this.initBarListByQueryKey(res.queryKey,reload);
        })
    }
    initPieListByMenuId=(flag,reload)=>{
        this.state.pieSearchFlag=flag;
        let disabledColIds="";
        $("#pie_search_type_div #but_div div").css("color","#000");
        $("#pie_search_type_div #but_div div").css("border-bottom","#fff solid 1px");
        if(this.state.pieSearchFlag==this.state.日查询常量){
            $("#pie_search_type_div #date_but_div").css("color","#477A8F");
            $("#pie_search_type_div #date_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds="";
        }
        else if(this.state.pieSearchFlag==this.state.周查询常量){
            $("#pie_search_type_div #week_but_div").css("color","#477A8F");
            $("#pie_search_type_div #week_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds=this.state.日;
        }
        else if(this.state.pieSearchFlag==this.state.月查询常量){
            $("#pie_search_type_div #month_but_div").css("color","#477A8F");
            $("#pie_search_type_div #month_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds=this.state.日+","+this.state.月度周;
        }
        else if(this.state.pieSearchFlag==this.state.三个月查询常量) {
            $("#pie_search_type_div #three_month_but_div").css("color", "#477A8F");
            $("#pie_search_type_div #three_month_but_div").css("border-bottom", "#497DD0 solid 1px");
        }

        let startDate=this.getAddDate(-90);
        let endDate=this.getTodayDate();
        this.getTodayDate();
        Super.super({
            url:`api2/entity/${this.state.menuId}/list/tmpl`,
            method:'GET',
            query:{disabledColIds:disabledColIds,sortColIds:(68+"_ASC"),criteria_13:startDate+"~"+endDate}
        }).then((res) => {
            console.log("饼状图数据==="+JSON.stringify(res));
            if(!reload){//这里是初始化报警类型，只有在首次加载页面的时候初始化一次就行
                this.initPielegendData(31193);
            }
            this.initPieListByQueryKey(res.queryKey,reload);
        })
    }
    initBarListByQueryKey=(queryKey,reload)=>{
        Super.super({
            url:`api2/entity/list/${queryKey}/data`,
            method:'GET',
        }).then((res) => {
            this.initBarXAxisData(res);
            this.initBarSeriesDataList();
            this.initYAxisData(res);
            if(!reload)
                this.initTodayBjCount(res);
        })
    }
    initPieListByQueryKey=(queryKey,reload)=>{
        Super.super({
            url:`api2/entity/list/${queryKey}/data`,
            method:'GET',
        }).then((res) =>{
            this.initPieSeriesDataList(res);
        })
    }
    initBarlegendData=(fieldId)=>{
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
            let todayBjCountList=this.state.todayBjCountList;
            let barSeriesNameList=this.state.barSeriesNameList;
            let barSeriesDataList=this.state.barSeriesDataList;
            let barSeriesColorList=this.state.barSeriesColorList;
            res.optionsMap[fieldId].map((item,index)=>{
                let 数据库里报警类型=this.state.报警类型数据库里名称;
                let 手机端报警类型=this.state.报警类型手机端显示名称;
                let color;
                switch (item.title) {
                    case 数据库里报警类型.紧急报警:
                        if(ldValueJj==null){
                            ldValueJj=手机端报警类型.紧急报警;
                            todayBjCountList[ldValueJj]=0;

                            color="#F00";
                            barSeriesNameList.push(ldValueJj);
                            barSeriesDataList[ldValueJj]=[];
                            barSeriesColorList[ldValueJj]=color;
                            //series.push({name:ldValueJj,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueJj);
                        }
                        break;
                    case 数据库里报警类型.缺员报警:
                    case 数据库里报警类型.超员报警:
                        if(ldValueQc==null){
                            ldValueQc=手机端报警类型.缺员超员报警;
                            todayBjCountList[ldValueQc]=0;

                            //console.log(手机端报警类型.缺员超员报警)
                            color="#0F0";
                            barSeriesNameList.push(ldValueQc);
                            barSeriesDataList[ldValueQc]=[];
                            barSeriesColorList[ldValueQc]=color;
                            //series.push({name:ldValueQc,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueQc);
                        }
                        break;
                    case 数据库里报警类型.滞留报警:
                    case 数据库里报警类型.串岗报警:
                        if(ldValueZc==null){
                            ldValueZc=手机端报警类型.串岗滞留报警;
                            todayBjCountList[ldValueZc]=0;

                            color="#00F";
                            barSeriesNameList.push(ldValueZc);
                            barSeriesDataList[ldValueZc]=[];
                            barSeriesColorList[ldValueZc]=color;
                            //series.push({name:ldValueZc,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueZc);
                        }
                        break;
                    case 数据库里报警类型.静止报警:
                        if(ldValueJz==null){
                            ldValueJz=手机端报警类型.静止报警;
                            todayBjCountList[ldValueJz]=0;

                            color="#2f2f4f";
                            barSeriesNameList.push(ldValueJz);
                            barSeriesDataList[ldValueJz]=[];
                            barSeriesColorList[ldValueJz]=color;
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
            this.setState({barLegendData:ldMap});
            //this.setState({series:series});
        })
    }
    initPielegendData=(fieldId)=>{
        Super.super({
            url:`api2/ks/clist/elefence/list/data`,
            method:'GET',
            query: {fieldIds:fieldId}
        }).then((res) => {
            let pieLegendData=[];
            this.state.bjqySelectList=res.result.entities;
            this.state.bjqySelectList.map((item,index)=>{
                pieLegendData.push(item["默认字段组"]["名称"]);
            });

            this.setState({pieLegendData:pieLegendData});
        });
    }
    initBarXAxisData=(res)=>{
        let xAxisData=[];
        res.entities.map((item,index)=>{
            let cellMap=item.cellMap;
            //console.log("cellMap==="+JSON.stringify(cellMap));
            if(this.state.barSearchFlag==this.state.日查询常量){
                if(!this.checkBarXAxisDataExist(xAxisData,cellMap[this.state.月]+"-"+cellMap[this.state.日])){
                    xAxisData.push(cellMap[this.state.月]+"-"+cellMap[this.state.日]);
                }
            }
            else if(this.state.barSearchFlag==this.state.周查询常量){
                let fxd=this.formatterXAxisData(cellMap,this.state.barSearchFlag)
                if(!this.checkBarXAxisDataExist(xAxisData,fxd))
                    xAxisData.push(fxd);
            }
            else if(this.state.barSearchFlag==this.state.月查询常量){
                if(!this.checkBarXAxisDataExist(xAxisData,cellMap[this.state.月]))
                    xAxisData.push(cellMap[this.state.月]);
            }
        });
        /*
        res.entities.map((item,index)=>{
            let cellMap=item.cellMap;
            //console.log("cellMap==="+JSON.stringify(cellMap));
            if(this.state.barSearchFlag==this.state.日查询常量)
                xAxisData.push(cellMap[this.state.月]+"-"+cellMap[this.state.日]);
            else if(this.state.barSearchFlag==this.state.周查询常量)
                xAxisData.push(cellMap[this.state.年]+"年"+cellMap[this.state.月]+"月"+cellMap[this.state.月度周]);
            else if(this.state.barSearchFlag==this.state.月查询常量)
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

            if(this.state.barSearchFlag==this.state.日查询常量){
                //console.log(cellMap[this.state.月]+"-"+cellMap[this.state.日]);
                this.state.barSeriesDataList[手报警类型].map((sdItem,sdIndex)=>{
                    if(sdItem.xLabel==cellMap[this.state.月]+"-"+cellMap[this.state.日]){
                        sdItem.yLabel=sdItem.yLabel+=parseInt(cellMap[this.state.数量]);
                    }
                });
            }
            else if(this.state.barSearchFlag==this.state.周查询常量){
                this.state.barSeriesDataList[手报警类型].map((sdItem,sdIndex)=>{
                    if(sdItem.xLabel==this.formatterXAxisData(cellMap,this.state.周查询常量)){
                        //console.log(sdItem.xLabel+","+cellMap[this.state.报警类型]+","+cellMap[this.state.数量])
                        sdItem.yLabel=sdItem.yLabel+=parseInt(cellMap[this.state.数量]);
                    }
                });
            }
            else if(this.state.barSearchFlag==this.state.月查询常量){
                this.state.barSeriesDataList[手报警类型].map((sdItem,sdIndex)=>{
                    if(sdItem.xLabel==cellMap[this.state.月]){
                        //console.log(sdItem.xLabel+","+cellMap[this.state.报警类型]+","+cellMap[this.state.数量])
                        sdItem.yLabel=sdItem.yLabel+=parseInt(cellMap[this.state.数量]);
                    }
                });
            }
            console.log(手报警类型+":"+JSON.stringify(this.state.barSeriesDataList[手报警类型]))//经测试没问题
        });

        this.state.barLegendData.map((item,index)=>{
            let data=[];
            this.state.barSeriesDataList[item].map((sdItem,sdIndex)=>{
                data.push(sdItem.yLabel);
            });
            series.push({name:item,type:'bar',data:data,barGap:0,itemStyle:{normal:{color:this.state.barSeriesColorList[item]}}});
        });
        this.setState({series:series});
    }
    initTodayBjCount=(res)=>{
        let todayDate=this.getTodayDate();
        let todayBjCountList=this.state.todayBjCountList;
        res.entities.map((item,index)=>{
            let cellMap=item.cellMap;
            if(todayDate==cellMap[this.state.日期]){
                console.log("todayDate==="+todayDate+","+cellMap[this.state.日期])
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
                todayBjCountList[手报警类型]+=parseInt(cellMap[this.state.数量]);
            }
        });
        console.log(todayBjCountList)
        this.setState({todayBjCountList:todayBjCountList});
    }
    getTodayDate=()=>{
        let date=new Date();
        let year=date.getFullYear();
        let month=date.getMonth()+1;
        let dateOfMonth=date.getDate();
        let todayDate=year+"-"+(month<10?"0"+month:month)+"-"+(dateOfMonth<10?"0"+dateOfMonth:dateOfMonth);
        return todayDate;
    }
    getAddDate=(days)=>{
        let date=new Date();
        date=new Date(date.setDate(date.getDate()+days));
        let year=date.getFullYear();
        let month=date.getMonth()+1;
        let dateOfMonth=date.getDate();
        return year+"-"+(month<10?"0"+month:month)+"-"+(dateOfMonth<10?"0"+dateOfMonth:dateOfMonth);
    }
    initBarSeriesDataList=()=>{
        //先把上次加载的数据清空
        this.state.barLegendData.map((item,index)=>{
            this.state.barSeriesDataList[item]=[];
        });

        //清空上次加载的数据后，再加载新数据
        this.state.xAxisData.map((xItem)=>{
            this.state.barLegendData.map((legItem,index)=>{
                this.state.barSeriesDataList[legItem].push({"xLabel":xItem,"yLabel":0});
            });
        });
        console.log("---"+JSON.stringify(this.state.barSeriesDataList[this.state.报警类型手机端显示名称.缺员超员报警]))
    }
    initPieSeriesDataList=(res)=>{
        let entities=res.entities;
        let bjqySelectList=this.state.bjqySelectList;
        let pieSeriesDataList=[];
        entities.map((item,index)=> {
            bjqySelectList.map((bjqylItem,bjqylIndex)=>{
                let cellMap = item.cellMap;
                console.log("===+++"+JSON.stringify(cellMap))
                if(bjqylItem["默认字段组"]["围栏编码"]==cellMap[this.state.报警围栏]){
                    let bjlxList=[];
                    this.state.barLegendData.map((bjlxItem,bjlxIndex)=>{
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

                        bjlxList.push({name:手报警类型,count:cellMap[this.state.数量]});
                    });
                    //pieSeriesDataList.push({value: 1548,name: '一车间', selected: true});
                    pieSeriesDataList.push({value: 1548,name: bjqylItem["默认字段组"]["名称"],bjlxList:bjlxList, selected: true});
                }
                //if(item["围栏名称"]==)
            });
        });
        this.setState({pieSeriesDataList:pieSeriesDataList});
        console.log(JSON.stringify(pieSeriesDataList))
    }
    checkBarXAxisDataExist=(xAxisData,xData)=>{
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
        //console.log("label==="+label)
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
                data:this.state.barLegendData
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
                text: '车间报警统计',
                //subtext: '虚构数据',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                //formatter: '{a} <br/>{b} : {c} ({d}%)<br/>aaaaaaa'
                formatter:function (json) {
                    console.log("json==="+JSON.stringify(json)+","+JSON.stringify(json["data"]["bjlxList"]))
                    let html="";
                    html+=json["data"]["name"]+":"+json["data"]["value"]
                    let bjlxList=json["data"]["bjlxList"];
                    bjlxList.map((item,index)=>{
                        html+="<br/>"+item.name+":"+item.count
                    });
                    return html
                }
            },
            legend: {
                // orient: 'vertical',
                // top: 'middle',
                bottom: 10,
                left: 'center',
                data: this.state.pieLegendData
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
                    data:this.state.pieSeriesDataList,
                    /*
                    data: [
                        {value: 1548,name: '一车间',name1:'aaa', selected: true},
                        {value: 535, name: '荆州'},
                        {value: 510, name: '兖州', selected: true},
                        {value: 634, name: '益州'},
                        {value: 735, name: '西凉', selected: true}
                    ],
                    */
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            ]
        }
        return option;
    }
    setDPDate=(flag,value)=>{
        if(flag=="start")
            this.state.barStartDate=moment(value).format('YYYY-MM-DD HH:mm:ss');
        else if(flag=="end")
            this.state.barEndDate=moment(value).format('YYYY-MM-DD HH:mm:ss');
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
        const {日查询常量,周查询常量,月查询常量,三个月查询常量,barLegendData,todayBjCountList}=this.state
        let {itemDiv}=this.state
        return <div className="bjInfoPage_div">
            <div className="top_div">报警统计</div>
            <div className="back_but_div" onClick={this.goPage.bind(this,'testHome')}>&lt;返回</div>
            <div>
                <div className="jrbjtjsl_div">
                    <div className="jrbjsl_tit_div">今日报警</div>
                    <div className="count_list_div">
                        {
                            barLegendData.map((item,index)=>{
                                if(index%2==0){
                                    itemDiv=<div className="item_div" style={{marginTop:'0px',marginLeft:'0px'}}>
                                        <span className="text_span">{item}</span>
                                        <span className="count_span">{todayBjCountList[item]}</span>
                                    </div>
                                }
                                else{
                                    itemDiv=<div className="item_div" style={{marginTop:'-30px',marginLeft:'200px'}}>
                                            <div className="text_span">{item}</div>
                                            <div className="count_span">{todayBjCountList[item]}</div>
                                        </div>
                                }
                                return itemDiv
                            })
                        }
                        {/*<div className="item_div">*/}
                        {/*    <span className="text_span">人员长时间静止报警</span>*/}
                        {/*    <span className="count_span">33</span>*/}
                        {/*</div>*/}
                        {/*<div className="item_div" style={{marginTop:'-30px',marginLeft:'200px'}}>*/}
                        {/*    <div className="text_span">缺员报警</div>*/}
                        {/*    <div className="count_span">3</div>*/}
                        {/*</div>*/}
                        {/*<div className="item_div" style={{marginTop:'0px',marginLeft:'0px'}}>*/}
                        {/*    <div className="text_span">超员报警</div>*/}
                        {/*    <div className="count_span">3</div>*/}
                        {/*</div>*/}
                        {/*<div className="item_div" style={{marginTop:'-30px',marginLeft:'200px'}}>*/}
                        {/*    <div className="text_span">串岗报警</div>*/}
                        {/*    <div className="count_span">3</div>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className="bar_search_type_div" id="bar_search_type_div">
                    <div className="but_div" id="but_div">
                        <div className="date_but_div" id="date_but_div" onClick={(e)=>this.initBarListByMenuId(日查询常量,true)}>日</div>
                        <div className="week_but_div" id="week_but_div" onClick={(e)=>this.initBarListByMenuId(周查询常量,true)}>周</div>
                        <div className="month_but_div" id="month_but_div" onClick={(e)=>this.initBarListByMenuId(月查询常量,true)}>月</div>
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
            </div>
            <div className="pie_search_type_div" id="pie_search_type_div">
                <div className="but_div" id="but_div">
                    <div className="date_but_div" id="date_but_div" onClick={(e)=>this.initPieListByMenuId(日查询常量,true)}>日</div>
                    <div className="week_but_div" id="week_but_div" onClick={(e)=>this.initPieListByMenuId(周查询常量,true)}>周</div>
                    <div className="month_but_div" id="month_but_div" onClick={(e)=>this.initPieListByMenuId(月查询常量,true)}>月</div>
                    <div className="three_month_but_div" id="three_month_but_div" onClick={(e)=>this.initPieListByMenuId(三个月查询常量,true)}>三个月</div>
                </div>
            </div>
            <div className="pie_div">
                <PieReactEcharts className="reactEcharts" id="echart" option={this.getPieOption()}/>
            </div>
        </div>;
    }
}

export default withRouter(TestDataTj)