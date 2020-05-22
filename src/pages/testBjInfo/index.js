import {withRouter} from "react-router-dom";
import React, {Component} from 'react'
import "./index.less";
import $ from "jquery";

class TestBjInfo extends Component{

    componentDidMount(){
        $("html").css("background-color","#fff");
    }

    render(){
        return <div className="bjInfoPage_div">
            <div className="top_div">报警信息</div>
            <div className="back_but_div" onClick={this.goPage.bind('')}>&lt;返回</div>
            <div>
                区域：
                <select>
                    <option>111</option>
                </select>
                报警类型：
                <select>
                    <option>111</option>
                </select>
                <button>一键确认</button>
            </div>
        </div>;
    }
}

export default withRouter(TestBjInfo)