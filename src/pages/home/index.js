import {NavLink, withRouter} from "react-router-dom";
import React, {Component} from 'react'
import Super from "../../super"
import {Accordion, Icon, List, Toast, Popover} from "antd-mobile";
import Storage from "../../units/storage";
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
const Item = Popover.Item;

class Home extends Component{
    state={homeState:[],menuTreeNode:[]}

    componentDidMount() {
        //this.request();
        $("html").css("background-color","#154E6C");
        this.initNavListDiv();
    }
    initNavListDiv=()=>{
        let nldw=$("#nav_list_div").css("width");
        nldw=nldw.substring(0,nldw.length-2);
        $("#nav_list_div").css("height",nldw*1155/650+"px");
    }
    /*
    request = () => {
        Super.super({
            url: 'api2/meta/menu/get_blocks',
        }).then((res) => {
            const currentBlockId=res.currentBlockId;
            console.log(res);
            this.setBlocks(currentBlockId,res.blocks);
            const homeData = this.renderData(res.blocks)
            this.setState({
                homeData,
                blocks:res.blocks,
            })
        })
    }
    setBlocks=(blockId,resBlocks)=>{
        Toast.info(blockId);
        let {blocks}=this.state
        let blockList
        if(resBlocks){
            blocks=resBlocks
        }
        blocks.forEach((item)=>{
            if(item.id===blockId){
                blockList=item.l1Menus
            }
        })
        const menuTreeNode=this.renderMenu(blockList);
        const data=this.renderData(blockList);
        Storage.menuList=data   //普通菜单存储
        console.log(menuTreeNode.length);
        this.setState({menuTreeNode});
    }
    renderMenu=(data)=>{
        return data.map((item)=>{
            if(item.l1Menus)
                return <div>2:{this.renderMenu(item.l1Menus)}<Icon type="right" size="sm"/></div>
            else
                return <div>1:{item.title}</div>
        });
    }
    renderData=(data)=>{
        data.forEach((item) => {
            item.value = item.id
            item.label = item.title
            if(item.l2Menus) {
                item.children = item.l2Menus
                item.children.forEach((it) => {
                    it.value = it.id
                    it.label = it.title
                })
            }
        })
        return data
    }
     */
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
                <div className="bqsy_div">版权所有2018-2020辰麒数维</div>
            </div>
        );
    }
}

export default withRouter(Home)