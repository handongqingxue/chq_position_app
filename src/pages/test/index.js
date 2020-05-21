import {createForm} from "rc-form";
import React, {Component} from 'react'
import {InputItem, Toast} from "antd-mobile";
import Super from "./../../super";
import "./index.less"
import Button from "antd-mobile/es/button";

class Test extends Component{
    state = {
        username:"",
        password:"",
    }

    submit=()=>{
        this.props.form.validateFields((error,value)=>{


            if(!error){
                Super.super({
                    url:"api2/auth/token",
                    method:"get",
                    query:value
                }).then((res)=>{
                    if(res.status=="504"){
                        Toast.info('服务器连接失败');
                    }
                    else{
                        Toast.info(res.status);
                    }
                });
            }
            else
                Toast.info(222);
        });
    }

    render(){
        const {username,password}=this.state
        const {getFieldProps,getFieldError}=this.props.form;
        return <div className="main_div">
            <h1 className="title_h1">人员定位系统手机版</h1>
        <InputItem {...getFieldProps("username",{initialValue:username})} placeholder="请输入用户名"/>
        <InputItem {...getFieldProps("password",{initialValue:password})} placeholder="请输入密码"/>
            <Button type="primary" onClick={this.submit}>登录</Button>
        </div>
    }
}
export default createForm()(Test)