import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import Super from "../../super";

class TestFixedSet extends Component{
    state={menuId:96653404938261,groupsList:[],selectList:[]}

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
            let selectId=[];
            groupsList.map((item,index)=>{
                item.fields.map((it)=>{
                    if(it.type=="select"||it.type=="label")
                        selectId.push(it.fieldId);
                })
            });
            this.setState({groupsList:groupsList});

            Super.super({
                url:`api2/meta/dict/field_options`,
                data:{
                    fieldIds:selectId.join(',')
                },
            }).then((res)=>{
                console.log(JSON.stringify(res))
                let selectList=[];
                let optionsMap=res.optionsMap;
                for(let key in optionsMap){
                    selectList[key]=optionsMap[key]
                    console.log("selectList=="+JSON.stringify(selectList[key]))
                }
                this.setState({selectList:selectList});
            });
        });
    }
    render() {
        const {groupsList,selectList}=this.state
        let {itemDiv,itemFields,fieldDiv}=this.state
        return <div className="fsPage_div">
            <div className="groups_list_div">
                {
                    groupsList.map((item,index)=>{
                        return <div>
                            <div>{item.title}</div>
                                {
                                    item.fields.map((fieldItem,fieldIndex)=>{
                                        return <div fieldId={fieldItem.fieldId}>
                                            <div>{fieldItem.title}</div>
                                            <div>{fieldItem.fieldId}-{fieldItem.type}</div>
                                            <div>
                                                {fieldItem.type=="select"
                                                    ?
                                                    <select>
                                                        {
                                                            selectList[fieldItem.fieldId]
                                                                ?
                                                                selectList[fieldItem.fieldId].map((selectItem,selectIndex)=>{
                                                                    return <option value={selectItem.value}>{selectItem.title}</option>
                                                                })
                                                                :
                                                                <option>暂无</option>
                                                        }
                                                    </select>
                                                    :
                                                    'aaa'
                                                }
                                            </div>
                                        </div>
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