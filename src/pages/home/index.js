import {withRouter} from "react-router-dom";
import React, {Component} from 'react'
import "./index.less";
import ssdwImg from "../../image/002.png";
import ryzzImg from "../../image/003.png";
import gjfxImg from "../../image/004.png";
import bjsjImg from "../../image/005.png";
import sjtjImg from "../../image/006.png";
import dzxjImg from "../../image/007.png";
import dwpzImg from "../../image/008.png";
import tcdlImg from "../../image/009.png";
import $ from 'jquery';

class Home extends Component{
    state={homeState:[],menuTreeNode:[]}

    componentDidMount() {
        $("html").css("background-color","#154E6C");
        this.initNavListDiv();
    }
    initNavListDiv=()=>{
        let nldw=$("#nav_list_div").css("width");
        nldw=nldw.substring(0,nldw.length-2);
        $("#nav_list_div").css("height",nldw*1155/650+"px");
    }
    goPage = (value) => {
        this.props.history.push(`/${value}`)
    }

    render() {
        return(
            <div className="homePage_div">
                <div className="top_div">辰麒人员定位管理系统</div>
                <div className="main_div">
                <div className="nav_list_div" id="nav_list_div">
                    <div className="item_div ssdw_div">
                        <img src={ssdwImg}/>
                        <div className="text_div">实时定位</div>
                    </div>
                    <div className="item_div ryzz_div">
                        <img src={ryzzImg}/>
                        <div className="text_div">人员追踪</div>
                    </div>
                    <div className="item_div gjfx_div">
                        <img src={gjfxImg}/>
                        <div className="text_div">轨迹分析</div>
                    </div>
                    <div className="item_div bjsj_div" onClick={this.goPage.bind(this,'bjInfo')}>
                        <img src={bjsjImg}/>
                        <div className="text_div">报警事件</div>
                    </div>
                    <div className="item_div sjtj_div" onClick={this.goPage.bind(this,'dataTj')}>
                        <img src={sjtjImg}/>
                        <div className="text_div">数据统计</div>
                    </div>
                    <div className="item_div dzxj_div">
                        <img src={dzxjImg}/>
                        <div className="text_div">电子巡检</div>
                    </div>
                    <div className="item_div dwpz_div" onClick={this.goPage.bind(this,'fixedSet')}>
                        <img src={dwpzImg}/>
                        <div className="text_div">定位配置</div>
                    </div>
                    <div className="item_div tcdl_div" onClick={this.goPage.bind(this,'login')}>
                        <img src={tcdlImg}/>
                        <div className="text_div">退出登录</div>
                    </div>
                </div>
                </div>
                <div className="space_div"></div>
                <div className="bqsy_div">版权所有2018-2020辰麒数维</div>
            </div>
        );
    }
}

export default withRouter(Home)