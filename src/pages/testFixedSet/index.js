import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import Super from "../../super";

class TestFixedSet extends Component{
    state={menuId:96653404938261,groupsList:[]}

    componentDidMount(){
        this.request();
    }
    request=()=>{
        Super.super({
            url:`api2/meta/tmpl/${this.state.menuId}/dtmpl/normal/`,
            method:'GET',
        }).then((res) => {
            console.log(res)
            let groupsList=res.config.dtmpl.groups;
            console.log(groupsList[0].title)
            this.setState({groupsList:groupsList});
        });
    }
    render() {
        const {groupsList}=this.state
        let {itemDiv,itemFields,fieldDiv}=this.state
        return <div className="fsPage_div">
            <div className="groups_list_div">
                {
                    groupsList.map((item,index)=>{
                        return <div>
                            <div>{item.title}</div>
                                {
                                    item.fields.map((fieldItem,fieldIndex)=>{
                                        return <div>aaa</div>
                                    })
                                }
                        </div>
                    })
                }
            </div>
        </div>;
    }
}

export default withRouter(TestFixedSet)