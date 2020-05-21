import {NavLink, withRouter} from "react-router-dom";
import React, {Component} from 'react'
import Nav from "../../components/Nav";
import Super from "../../super"
import {Accordion, Icon, List, Toast, Popover} from "antd-mobile";
import Storage from "../../units/storage";
import "./index.less"
const Item = Popover.Item;

class TestHome extends Component{
    state={homeState:[],menuTreeNode:[]}

    componentDidMount() {
        this.request()
    }
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

    handlePop = (value) => {
        this.props.history.push(`/${value}`)
    }

    render() {
        const {homeData,menuTreeNode}=this.state
        const homePop=[(<div style={{marginTop:'10px'}}>aaa</div>)];
        return(
            <div>
                <Nav
                title="HYDROCARBON"
                data={homeData}
                handleSelected={this.handlePop}
                pops={homePop}
                level={1}
                setBlocks={this.setBlocks}
                />
                <div className="item_div">{menuTreeNode}</div>
            </div>
        );
    }
}

export default withRouter(TestHome)