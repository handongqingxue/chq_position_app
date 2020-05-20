import {NavLink, withRouter} from "react-router-dom";
import React, {Component} from 'react'
import Nav from "../../components/Nav";
import Super from "../../super"
import {Accordion, Icon, List, Toast, Popover} from "antd-mobile";
import Storage from "../../units/storage";
const Item = Popover.Item;

class TestHome extends Component{
    state={homeState:[]}

    componentDidMount() {
        this.request()
    }
    request = () => {
        Super.super({
            url: 'api2/meta/menu/get_blocks',
        }).then((res) => {
            let currentBlockId=res.currentBlockId;
            this.setBlocks(currentBlockId);
        })
    }
    setBlocks=(blockId)=>{

    }

    handlePop = (value) => {
        this.props.history.push(`/${value}`)
    }

    render() {
        const {homeDate}=this.state
        return(
            <div>
                <Nav
                title="aaa"
                data={homeDate}
                level={1}
                />
            </div>
        );
    }
}

export default withRouter(TestHome)