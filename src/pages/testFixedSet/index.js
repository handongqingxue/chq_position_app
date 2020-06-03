import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import Super from "../../super";

class TestFixedSet extends Component{
    state={menuId:96653404938261,groupsList:[],selectList:[],fieldItemList:[]}

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

        Super.super({
            url:`api2/entity/${this.state.menuId}/detail/98972186405904392`,
            method:'GET',
        }).then((resi)=>{
            let fieldMap=resi.entity.fieldMap;
            console.log("resi.fieldMap==="+JSON.stringify(fieldMap))
            for(let key in fieldMap){
                this.state.fieldItemList[key]=fieldMap[key];
            }
        });
    }
    submit=()=>{
        Super.super({
            url:`api2/entity/${this.state.menuId}/detail/normal`,
            method:'POST',
            data:{'唯一编码':'99156204279701516','人员静止报警阈值':'1112'}
        }).then((res)=>{
            console.log(JSON.stringify(res))
        })
    }
    render() {
        const {groupsList,selectList,fieldItemList}=this.state
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
                                            <div>{fieldItem.id}-{fieldItem.type}</div>
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
                                                    <div id={'field_item_div'+fieldItem.id}>{fieldItemList[fieldItem.id]}</div>
                                                }
                                            </div>
                                        </div>
                                    })
                                }
                        </div>
                    })
                }
            </div>
            <div onClick={this.submit.bind(this)}>保存</div>
        </div>;
    }
}

export default withRouter(TestFixedSet)