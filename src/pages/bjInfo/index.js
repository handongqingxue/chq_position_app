import {withRouter} from "react-router-dom";
import React, {Component} from 'react'
import Super from "../../super"
import "./index.less";
import cjcyImg from "../../image/011.png";
import rycgImg from "../../image/012.png";
import ryyjjjImg from "../../image/013.png";
import rycsjjzImg from "../../image/014.png";
import $ from "jquery";
import {Toast} from "antd-mobile";
import alert from "antd-mobile/lib/modal/alert";

class BjInfo extends Component{
    state={menuId:28,selectIds:{bjqyId:"",bjlxId:""},fieldIds:{bjlxFieldId:"",bjqyFieldId:""},bjlxSelectList:[],bjqySelectList:[],bjList:[],
        columnsId:{},
        criteriasFieldKey:{},
        实体名称字段:"实体名称",
        处理状态字段:"处理状态",
        围栏名称字段:"围栏名称",
        报警类型字段:"报警类型",
        报警时间字段:"报警时间",
        // 实体名称:208,
        // 处理状态:209,
        // 围栏名称:204,
        // 报警类型:210,
        // 报警时间:206,
        报警类型数据库里名称:{紧急报警:"人员一键紧急报警",缺员报警:"车间缺员报警",超员报警:"车间超员报警",串岗报警:"人员串岗报警",滞留报警:"人员滞留报警",静止报警:"人员长时间静止报警"},
        报警类型手机端显示名称:{紧急报警:"一键紧急报警",缺员超员报警:"车间缺员、超员报警",串岗滞留报警:"人员串岗、滞留报警",静止报警:"静止报警"},
        bjDetailTitle:"",bjDetailContent:"",bjDetailCode:""}

    componentDidMount(){
        $("html").css("background-color","#fff");
        this.request();
    }
    request=()=>{
        this.initListByMenuId(false);
    }
    initColumnsId=(resColumns)=>{
        let columnsId={};
        resColumns.map((item,index)=>{
            //console.log(item.title+","+item.id)
            columnsId[item.title]=item.id;
        });
        //console.log(columnsId)
        this.setState({columnsId:columnsId});
    }
    initListByMenuId=(reload)=>{
        let quyu=$("#quyu_select").val();
        let bjlxs=$("#bjlx_select").val();
        //console.log("bjlxs==="+bjlxs)
        Super.super({
            url:`api2/entity/${this.state.menuId}/list/tmpl`,
            method:'GET',
            query:{criteria_32:bjlxs,criteria_33:"待处理",criteria_37:quyu}
            //query:query
        }).then((res) => {
            //console.log(res);
            if(!reload){
                let criteriasFieldKey={};
                res.ltmpl.criterias.map((item,index)=>{
                    if(item.id==32){
                        this.state.selectIds.bjlxId=item.id;
                        this.state.fieldIds.bjlxFieldId=item.fieldId;
                    }
                    else if(item.id==37){
                        this.state.selectIds.bjqyId=item.id;
                        this.state.fieldIds.bjqyFieldId=item.fieldId;
                    }

                    criteriasFieldKey[item.title]=item.fieldKey;
                });
                this.setState({criteriasFieldKey:criteriasFieldKey});
                /*
                let bjqyId=this.state.selectIds.bjqyId;
                let bjqyFieldId=this.state.fieldIds.bjqyFieldId;
                this.initSelect(bjqyId,bjqyFieldId);
                 */
                this.initBJQYSelect();

                let bjlxId=this.state.selectIds.bjlxId;
                let bjlxFieldId=this.state.fieldIds.bjlxFieldId;
                this.initSelect(bjlxId,bjlxFieldId);
                this.initColumnsId(res.ltmpl.columns);
            }
            this.initListByQueryKey(res.queryKey);
        })
    }
    initListByQueryKey=(queryKey)=>{
        Super.super({
            url:`api2/entity/list/${queryKey}/data`,
            method:'GET',
            query:{pageSize:100}
        }).then((res) => {
            //console.log("==="+JSON.stringify(res));
            this.setState({bjList:res.entities});
        })
    }
    initSelect=(selectId,fieldId)=>{
        Super.super({
            url:`api2/meta/dict/field_options`,
            method:'GET',
            query: {fieldIds:fieldId}
        }).then((res) => {
            //console.log("fieldId==="+JSON.stringify(res.optionsMap[fieldId]));
            if(selectId==32){
                let bjlxSelectList=[];
                res.optionsMap[fieldId].map((item,index)=>{
                    let 数据库里报警类型=this.state.报警类型数据库里名称;
                    let 手机端报警类型=this.state.报警类型手机端显示名称;
                    let bjlxSelectItem;
                    let exist=false;
                    switch (item.title) {
                        case 数据库里报警类型.紧急报警:
                            bjlxSelectItem={title:手机端报警类型.紧急报警,value:数据库里报警类型.紧急报警}
                            break;
                        case 数据库里报警类型.缺员报警:
                        case 数据库里报警类型.超员报警:
                            exist=this.checkBjlxExistInSelect(bjlxSelectList,手机端报警类型.缺员超员报警)
                            bjlxSelectItem={title:手机端报警类型.缺员超员报警,value:数据库里报警类型.缺员报警+","+数据库里报警类型.超员报警}
                            break;
                        case 数据库里报警类型.滞留报警:
                        case 数据库里报警类型.串岗报警:
                            exist=this.checkBjlxExistInSelect(bjlxSelectList,手机端报警类型.串岗滞留报警)
                            bjlxSelectItem={title:手机端报警类型.串岗滞留报警,value:数据库里报警类型.滞留报警+","+数据库里报警类型.串岗报警}
                            break;
                        case 数据库里报警类型.静止报警:
                            bjlxSelectItem={title:手机端报警类型.静止报警,value:数据库里报警类型.静止报警}
                            break;
                    }
                    if(!exist)
                        bjlxSelectList.push(bjlxSelectItem);
                });
                this.setState({bjlxSelectList:bjlxSelectList});
            }
            else if(selectId==37)
                this.setState({bjqySelectList:res.optionsMap[fieldId]});
        })
    }
    checkBjlxExistInSelect=(bjlxList,title)=>{
        let exist=false;
        bjlxList.map((item,index)=>{
            if(item.title==title){
                exist=true;
                return exist;
            }
        });
        return exist;
    }
    initBJQYSelect=()=>{
        Super.super({
            url:`api2/ks/clist/elefence/list/data`,
            method:'GET',
            query:{pageSize:100}
        }).then((res) => {
            //console.log(res);
            this.setState({bjqySelectList:res.result.entities});
        })
    }
    substringItemName(value){
        if(value){
            return value.split("@R@")[1];
        }
        else
            return ""
    }
    showBjDetailDialogDiv(cellMap,code,show){
        //console.log(cellMap);
        if(show==1){
            this.state.bjDetailCode=code;
            this.setState({bjDetailTitle:cellMap[this.state.columnsId[this.state.报警类型字段]]});
            let content="";
            if(cellMap[this.state.columnsId[this.state.报警类型字段]].indexOf("车间超员")!=-1)
                content=this.substringItemName(cellMap[this.state.columnsId[this.state.围栏名称字段]])+"于"+cellMap[this.state.columnsId[this.state.报警时间字段]]+"超员"+cellMap[this.state.columnsId[this.state.处理状态字段]];
            else if(cellMap[this.state.columnsId[this.state.报警类型字段]].indexOf("车间缺员")!=-1)
                content=this.substringItemName(cellMap[this.state.columnsId[this.state.围栏名称字段]])+"于"+cellMap[this.state.columnsId[this.state.报警时间字段]]+"缺员"+cellMap[this.state.columnsId[this.state.处理状态字段]];
            else if(cellMap[this.state.columnsId[this.state.报警类型字段]].indexOf("人员串岗")!=-1)
                content=this.substringItemName(cellMap[this.state.columnsId[this.state.围栏名称字段]])+this.substringItemName(cellMap[this.state.columnsId[this.state.实体名称字段]])+"于"+cellMap[this.state.columnsId[this.state.报警时间字段]]+"串岗"+cellMap[this.state.columnsId[this.state.处理状态字段]];
            else if(cellMap[this.state.columnsId[this.state.报警类型字段]].indexOf("人员滞留")!=-1)
                content=this.substringItemName(cellMap[this.state.columnsId[this.state.围栏名称字段]])+this.substringItemName(cellMap[this.state.columnsId[this.state.实体名称字段]])+"于"+cellMap[this.state.columnsId[this.state.报警时间字段]]+"滞留"+cellMap[this.state.columnsId[this.state.处理状态字段]];
            else if(cellMap[this.state.columnsId[this.state.报警类型字段]].indexOf("人员一键紧急")!=-1)
                content=this.substringItemName(cellMap[this.state.columnsId[this.state.围栏名称字段]])+this.substringItemName(cellMap[this.state.columnsId[this.state.实体名称字段]])+"于"+cellMap[this.state.columnsId[this.state.报警时间字段]]+"紧急报警"+cellMap[this.state.columnsId[this.state.处理状态字段]];
            else if(cellMap[this.state.columnsId[this.state.报警类型字段]].indexOf("人员长时间静止")!=-1)
                content=this.substringItemName(cellMap[this.state.columnsId[this.state.围栏名称字段]])+this.substringItemName(cellMap[this.state.columnsId[this.state.实体名称字段]])+"于"+cellMap[this.state.columnsId[this.state.报警时间字段]]+"长时间静止"+cellMap[this.state.columnsId[this.state.处理状态字段]];
            this.setState({bjDetailContent:content});

            if(cellMap[this.state.columnsId[this.state.报警类型字段]].indexOf("车间超员")!=-1||cellMap[this.state.columnsId[this.state.报警类型字段]].indexOf("车间缺员")!=-1||
                cellMap[this.state.columnsId[this.state.报警类型字段]].indexOf("人员串岗")!=-1||cellMap[this.state.columnsId[this.state.报警类型字段]].indexOf("人员滞留")!=-1)
                $("#bj_detail_dialog_div #confirm_but_div").text("确认报警");
            else
                $("#bj_detail_dialog_div #confirm_but_div").text("报警已处理");
            $("#bj_detail_dialog_div").css("display","block");
        }
        else{
            this.state.bjDetailCode="";
            this.setState({bjDetailTitle:""});
            this.setState({bjDetailContent:""});
            $("#bj_detail_dialog_div #confirm_but_div").text("");
            $("#bj_detail_dialog_div").css("display","none");
        }
    }
    showDeleteAlert = () => {
        //alert(this.bjDetailCode);
        alert("处理操作","确认处理这条记录吗???",[{
                text:"取消"
            },
            {
                text:"确认",
                onPress:()=>this.handelState(this.state.bjDetailCode)
            }
        ])
    }
    handelState=(code)=>{
        console.log("code==="+code);
        let data={};
        data['唯一编码']=code;
        data[this.state.criteriasFieldKey[this.state.处理状态字段]]="已处理";
        Super.super({
            url: `api2/entity/${this.state.menuId}/detail/normal/`,
            method:'post',
            data: data
        }).then((res) => {
            //console.log("res==="+JSON.stringify(res));
            if(res.status === "suc") {
                Toast.success("处理成功！") //刷新列表
                this.showBjDetailDialogDiv(null,null,0);
                this.initListByMenuId(true);
            } else {
                Toast.info('处理失败！')
            }
        })
    }
    confirmAll=()=>{
        let codes="";
        this.state.bjList.map((item,index)=>{
            codes+=","+item.code;
        });
        this.state.bjDetailCode=codes.substring(1);
        console.log(this.state.bjDetailCode);
        this.showDeleteAlert();
    }
    goPage=(value)=>{
        this.props.history.push(`/${value}`);
    }

    render(){
        const {bjqySelectList,bjlxSelectList,bjList,columnsId,
            实体名称字段,围栏名称字段,报警类型字段,报警时间字段,
            bjDetailTitle,bjDetailContent}=this.state
        return <div className="bjInfoPage_div">
            <div className="bj_detail_dialog_div" id="bj_detail_dialog_div">
                <div className="main_div">
                    <span className="close_span" onClick={this.showBjDetailDialogDiv.bind(this,null,null,0)}>X</span>
                    <div className="title_div">{bjDetailTitle}</div>
                    <div className="content_div">{bjDetailContent}</div>
                    <div className="confirm_but_div" id="confirm_but_div" onClick={this.showDeleteAlert.bind(this)}></div>
                </div>
            </div>
            <div className="top_div">报警信息</div>
            <div className="back_but_div" onClick={this.goPage.bind(this,'home')}>&lt;返回</div>
            <div className="where_search_div">
                <select className="quyu_select" id="quyu_select" onChange={this.initListByMenuId.bind(this,true)}>
                    <option value="">区域</option>
                    {
                        bjqySelectList?bjqySelectList.map((item,index)=>
                            <option value={item.默认字段组.名称}>{item.默认字段组.名称}</option>
                        ):<option>暂无数据</option>
                    }
                </select>
                <select className="bjlx_select" id="bjlx_select" onChange={this.initListByMenuId.bind(this,true)}>
                    <option value="">报警类型</option>
                    {
                        bjlxSelectList?bjlxSelectList.map((item,index)=>
                            <option value={item.value}>{item.title}</option>
                        ):<option>暂无数据</option>
                    }
                </select>
                <button className="yjqr_but" onClick={this.confirmAll.bind()}>一键确认</button>
            </div>
            <div className="bj_list_div">
                {
                    bjList?bjList.map((item,index)=>
                        <div className="item_div" onClick={this.showBjDetailDialogDiv.bind(this,item.cellMap,item.code,1)}>
                            <img className="logo_img" src={
                                item.cellMap[columnsId[报警类型字段]].indexOf("车间超员")!=-1||item.cellMap[columnsId[报警类型字段]].indexOf("车间缺员")!=-1 ? cjcyImg :
                                    item.cellMap[columnsId[报警类型字段]].indexOf("人员串岗")!=-1||item.cellMap[columnsId[报警类型字段]].indexOf("人员滞留")!=-1?rycgImg:
                                        item.cellMap[columnsId[报警类型字段]].indexOf("人员一键紧急")!=-1?ryyjjjImg:
                                            item.cellMap[columnsId[报警类型字段]].indexOf("人员长时间静止")!=-1?rycsjjzImg:""
                            }/>
                            <div className="bjlx_div">{item.cellMap[columnsId[报警类型字段]]}</div>
                            <div className="bjnr_div">
                                {
                                    item.cellMap[columnsId[报警类型字段]].indexOf("车间超员")!=-1?this.substringItemName(item.cellMap[columnsId[围栏名称字段]])+"超员":
                                        item.cellMap[columnsId[报警类型字段]].indexOf("车间缺员")!=-1?this.substringItemName(item.cellMap[columnsId[围栏名称字段]])+"缺员":
                                            item.cellMap[columnsId[报警类型字段]].indexOf("人员串岗")!=-1?this.substringItemName(item.cellMap[columnsId[围栏名称字段]])+this.substringItemName(item.cellMap[columnsId[实体名称字段]])+"串岗":
                                                item.cellMap[columnsId[报警类型字段]].indexOf("人员滞留")!=-1?this.substringItemName(item.cellMap[columnsId[围栏名称字段]])+this.substringItemName(item.cellMap[columnsId[实体名称字段]])+"滞留":
                                                    item.cellMap[columnsId[报警类型字段]].indexOf("人员一键紧急")!=-1?this.substringItemName(item.cellMap[columnsId[围栏名称字段]])+this.substringItemName(item.cellMap[columnsId[实体名称字段]])+"紧急报警":
                                                        item.cellMap[columnsId[报警类型字段]].indexOf("人员长时间静止")!=-1?this.substringItemName(item.cellMap[columnsId[围栏名称字段]])+this.substringItemName(item.cellMap[columnsId[实体名称字段]])+"长时间静止":
                                                            item.cellMap[columnsId[围栏名称字段]]+item.cellMap[columnsId[实体名称字段]]
                                }
                            </div>
                            <div className="bjsj_div">{item.cellMap[columnsId[报警时间字段]]}</div>
                        </div>
                    ):<div>暂无数据</div>
                }
                {/*
                <div className="item_div">
                    <img className="logo_img" src={cjcyImg}/>
                    <div className="bjlx_div">报警类型</div>
                    <div className="bjnr_div">报警内容</div>
                    <div className="bjsj_div">1997-07-01</div>
                </div>
                */}
            </div>
        </div>;
    }
}

export default withRouter(BjInfo)