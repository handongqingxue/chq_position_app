import {withRouter} from "react-router-dom";
import React, {Component} from 'react'
import Super from "../../super"
import "./index.less";
import cjcyImg from "../../image/011.png";
import rycgImg from "../../image/012.png";
import ryyjjjImg from "../../image/013.png";
import rycsjjzImg from "../../image/014.png";
import $ from "jquery";

class TestBjInfo extends Component{
    state={menuId:28,selectIds:{bjqyId:"",bjlxId:""},fieldIds:{bjlxFieldId:"",bjqyFieldId:""},bjlxSelectList:[],bjqySelectList:[],bjList:[],
    实体名称:186,围栏名称:191,报警类型:192,报警时间:194}

    componentDidMount(){
        $("html").css("background-color","#fff");
        this.request();
    }
    request=()=>{
        this.initListByMenuId(false);
    }
    initListByMenuId=(reload)=>{
        let quyu=$("#quyu_select").val();
        let bjlx=$("#bjlx_select").val();
        Super.super({
            url:`api2/entity/${this.state.menuId}/list/tmpl`,
            method:'GET',
            query:{criteria_32:bjlx,criteria_37:quyu}
            //query:query
        }).then((res) => {
            console.log(res);
            if(!reload){
                res.ltmpl.criterias.map((item,index)=>{
                    if(item.id==32){
                        this.state.selectIds.bjlxId=item.id;
                        this.state.fieldIds.bjlxFieldId=item.fieldId;
                    }
                    else if(item.id==37){
                        this.state.selectIds.bjqyId=item.id;
                        this.state.fieldIds.bjqyFieldId=item.fieldId;
                    }
                });
                /*
                let bjqyId=this.state.selectIds.bjqyId;
                let bjqyFieldId=this.state.fieldIds.bjqyFieldId;
                this.initSelect(bjqyId,bjqyFieldId);
                 */
                this.initBJQYSelect();

                let bjlxId=this.state.selectIds.bjlxId;
                let bjlxFieldId=this.state.fieldIds.bjlxFieldId;
                this.initSelect(bjlxId,bjlxFieldId);
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
            this.setState({bjList:res.entities});
        })
    }
    initSelect=(selectId,fieldId)=>{
        Super.super({
            url:`api2/meta/dict/field_options`,
            method:'GET',
            query: {fieldIds:fieldId}
        }).then((res) => {
            console.log(res.optionsMap[fieldId]);
            if(selectId==32)
                this.setState({bjlxSelectList:res.optionsMap[fieldId]});
            else if(selectId==37)
                this.setState({bjqySelectList:res.optionsMap[fieldId]});
        })
    }
    initBJQYSelect=()=>{
        Super.super({
            url:`api2/ks/clist/elefence/list/data`,
            method:'GET',
            query:{pageSize:100}
        }).then((res) => {
            console.log(res);
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
    goPage=(value)=>{
        this.props.history.push(`/${value}`);
    }

    render(){
        const {bjqySelectList,bjlxSelectList,bjList,实体名称,围栏名称,报警类型,报警时间}=this.state
        return <div className="bjInfoPage_div">
            <div className="bj_detail_dialog_div">
                <div className="main_div"></div>
            </div>
            <div className="top_div">报警信息</div>
            <div className="back_but_div" onClick={this.goPage.bind(this,'testHome')}>&lt;返回</div>
            <div className="where_search_div">
                <select className="quyu_select" id="quyu_select">
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
                <button className="yjqr_but">一键确认</button>
            </div>
            <div className="bj_list_div">
                {
                    bjList?bjList.map((item,index)=>
                        <div className="item_div">
                            <img className="logo_img" src={
                                item.cellMap[192].indexOf("车间超员")!=-1||item.cellMap[192].indexOf("车间缺员")!=-1 ? cjcyImg :
                                    item.cellMap[192].indexOf("人员串岗")!=-1||item.cellMap[192].indexOf("人员滞留")!=-1?rycgImg:
                                        item.cellMap[192].indexOf("人员一键紧急")!=-1?ryyjjjImg:
                                            item.cellMap[192].indexOf("人员长时间静止")!=-1?rycsjjzImg:""
                            }/>
                            <div className="bjlx_div">{item.cellMap[192]}</div>
                            <div className="bjnr_div">
                                {
                                    item.cellMap[报警类型].indexOf("车间超员")!=-1?this.substringItemName(item.cellMap[围栏名称])+"超员":
                                        item.cellMap[报警类型].indexOf("车间缺员")!=-1?this.substringItemName(item.cellMap[围栏名称])+"缺员":
                                            item.cellMap[报警类型].indexOf("人员串岗")!=-1?this.substringItemName(item.cellMap[围栏名称])+this.substringItemName(item.cellMap[实体名称])+"串岗":
                                                item.cellMap[报警类型].indexOf("人员滞留")!=-1?this.substringItemName(item.cellMap[围栏名称])+this.substringItemName(item.cellMap[实体名称])+"滞留":
                                                    item.cellMap[报警类型].indexOf("人员一键紧急")!=-1?this.substringItemName(item.cellMap[围栏名称])+this.substringItemName(item.cellMap[实体名称])+"紧急报警":
                                                        item.cellMap[报警类型].indexOf("人员长时间静止")!=-1?this.substringItemName(item.cellMap[围栏名称])+this.substringItemName(item.cellMap[实体名称])+"长时间静止":
                                                            item.cellMap[围栏名称]+item.cellMap[实体名称]
                                }
                            </div>
                            <div className="bjsj_div">{item.cellMap[报警时间]}</div>
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

export default withRouter(TestBjInfo)