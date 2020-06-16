import {withRouter} from "react-router-dom";
import React, {Component} from "react";
import "./index.less";
import Super from "../../super";
import $ from "jquery";
import {Toast} from "antd-mobile";

class FixedSet extends Component{
    state={menuId:96653404938261,code:"98972186405904392",groupsList:[],selectList:[],fieldItemList:[]}

    componentDidMount(){
        $("html").css("background-color","#EDEDED");
        this.request();
    }
    request=()=>{
        Super.super({
            url:`api2/meta/tmpl/${this.state.menuId}/dtmpl/normal/`,
            method:'GET',
        }).then((res) => {
            //console.log(res)
            let groupsList=res.config.dtmpl.groups;
            //console.log(groupsList[0].title)
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
                //console.log(JSON.stringify(res))
                let selectList=[];
                let optionsMap=res.optionsMap;
                for(let key in optionsMap){
                    selectList[key]=optionsMap[key]
                    //console.log("selectList=="+JSON.stringify(selectList[key]))
                }
                this.setState({selectList:selectList});
                this.initDetail()
            });
        });
    }
    initDetail=()=>{
        Super.super({
            url:`api2/entity/${this.state.menuId}/detail/${this.state.code}`,
            method:'GET',
        }).then((resi)=>{
            let fieldMap=resi.entity.fieldMap;
            //console.log("resi.fieldMap==="+JSON.stringify(fieldMap))
            for(let key in fieldMap){
                this.state.fieldItemList[key]=fieldMap[key];
            }
            this.initData()
        });
    }
    initData=()=>{
        let groupsList=this.state.groupsList;
        let fieldItemList=this.state.fieldItemList;
        groupsList.map((item,index)=>{
            let fields=item.fields;
            fields.map((fieldItem,fieldIndex)=>{
                if(fieldItem.type=="select"){
                    $("#field_item_select"+fieldItem.id+" option[value='"+fieldItemList[fieldItem.id]+"']").attr("selected",true)
                }
                else {
                    $("#field_item_input"+fieldItem.id).val(fieldItemList[fieldItem.id])
                }
            });
        });
    }
    submit=()=>{
        let data={};
        data['唯一编码']=this.state.code;
        let groupsList=this.state.groupsList;
        groupsList.map((item,index)=>{
            let fields=item.fields;
            fields.map((fieldItem,fieldIndex)=>{
                if(fieldItem.type=="select"){
                    console.log(fieldItem.title+","+$("#field_item_select"+fieldItem.id).val())
                    data[fieldItem.title]=$("#field_item_select"+fieldItem.id).val();
                }
                else{
                    console.log(fieldItem.title+","+$("#field_item_input"+fieldItem.id).val())
                    data[fieldItem.title]=$("#field_item_input"+fieldItem.id).val();
                }
            });
        });
        console.log(data)
        //return false;
        Super.super({
            url:`api2/entity/${this.state.menuId}/detail/normal`,
            method:'POST',
            data:data
        }).then((res)=>{
            //console.log(JSON.stringify(res))
            if(res && res.status==="suc") {
                Toast.success("保存成功！")
                this.goPage('home')
            }
            else{
                Toast.fail("保存失败!")
            }
        })
    }
    goPage=(value)=>{
        this.props.history.push(`/${value}`);
    }
    render() {
        const {groupsList,selectList,fieldItemList}=this.state
        let {itemDiv,itemFields,fieldDiv}=this.state
        return <div className="fsPage_div">
            <div className="top_div">定位配置</div>
            <div className="back_but_div" onClick={this.goPage.bind(this,'home')}>&lt;返回</div>
            <div className="groups_list_div">
                {
                    groupsList.map((item,index)=>{
                        return <div className="groups_item_div">
                            <div className="title_div">{item.title}</div>
                                {
                                    item.fields.map((fieldItem,fieldIndex)=>{
                                        return <div className="field_item_div" fieldId={fieldItem.fieldId}>
                                            <div className="title_div">{fieldItem.title}</div>
                                            {/*<div>{fieldItem.id}-{fieldItem.type}</div>*/}
                                            <div className="value_div">
                                                {fieldItem.type=="select"
                                                    ?
                                                    <select id={'field_item_select'+fieldItem.id}>
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
                                                    <input id={'field_item_input'+fieldItem.id}/>
                                                }
                                            </div>
                                        </div>
                                    })
                                }
                        </div>
                    })
                }
            </div>
            <div className="submitBut_div" onClick={this.submit}>保存</div>
        </div>;
    }
}

export default withRouter(FixedSet)