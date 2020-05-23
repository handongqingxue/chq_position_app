import {withRouter} from "react-router-dom";
import React, {Component} from 'react'
import "./index.less";
import cjcyImg from "../../image/011.png";
import $ from "jquery";

class TestBjInfo extends Component{

    componentDidMount(){
        $("html").css("background-color","#fff");
    }
    goPage=(value)=>{
        this.props.history.push(`/${value}`);
    }

    render(){
        return <div className="bjInfoPage_div">
            <div className="top_div">报警信息</div>
            <div className="back_but_div" onClick={this.goPage.bind(this,'testHome')}>&lt;返回</div>
            <div className="where_search_div">
                <span className="quyu_span">区域：</span>
                <select>
                    <option>一车间</option>
                </select>
                <span className="bjlx_span">报警类型：</span>
                <select>
                    <option>车间超员</option>
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