import {withRouter} from "react-router-dom";
import React, {Component} from 'react'
import Super from "../../super"
import "./index.less";
import cjcyImg from "../../image/011.png";
import $ from "jquery";

class TestBjInfo extends Component{
    state={selectIds:{bjqyId:"",bjlxId:""},fieldIds:{bjlxFieldId:"",bjqyFieldId:""},bjlxSelectList:[],bjqySelectList:[]}

    componentDidMount(){
        $("html").css("background-color","#fff");
        this.request();
    }
    request=()=>{
        Super.super({
            url:`api2/entity/${28}/list/tmpl`,
            method:'GET',
        }).then((res) => {
            console.log(res);
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

            let bjqyId=this.state.selectIds.bjqyId;
            let bjqyFieldId=this.state.fieldIds.bjqyFieldId;
            this.initSelect(bjqyId,bjqyFieldId);

            let bjlxId=this.state.selectIds.bjlxId;
            let bjlxFieldId=this.state.fieldIds.bjlxFieldId;
            this.initSelect(bjlxId,bjlxFieldId);

            Super.super({
                url:`api2/entity/list/${res.queryKey}/data`,
                method:'GET',
            }).then((res) => {
                console.log(res);
            })
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
    goPage=(value)=>{
        this.props.history.push(`/${value}`);
    }

    render(){
        const {bjqySelectList,bjlxSelectList}=this.state
        return <div className="bjInfoPage_div">
            <div className="top_div">报警信息</div>
            <div className="back_but_div" onClick={this.goPage.bind(this,'testHome')}>&lt;返回</div>
            <div className="where_search_div">
                <span className="quyu_span">区域：</span>
                <select>
                    {
                        bjqySelectList?bjqySelectList.map((item,index)=>
                            <option>一车间</option>
                        ):<option>暂无数据</option>
                    }
                </select>
                <span className="bjlx_span">报警类型：</span>
                <select>
                    {
                        bjlxSelectList?bjlxSelectList.map((item,index)=>
                            <option>{item.title}</option>
                        ):<option>暂无数据</option>
                    }
                </select>
                <button className="yjqr_but">一键确认</button>
            </div>
            <div className="bj_list_div">
                <div className="item_div">
                    <img className="logo_img" src={cjcyImg}/>
                    <div className="bjlx_div">报警类型</div>
                    <div className="bjnr_div">报警内容</div>
                    <div className="bjsj_div">1997-07-01</div>
                </div>
                <div className="item_div">
                    <img className="logo_img" src={cjcyImg}/>
                    <div className="bjlx_div">报警类型</div>
                    <div className="bjnr_div">报警内容</div>
                    <div className="bjsj_div">1997-07-01</div>
                </div>
            </div>
        </div>;
    }
}

export default withRouter(TestBjInfo)