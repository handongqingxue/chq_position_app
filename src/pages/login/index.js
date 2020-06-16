import {createForm} from "rc-form";
import React, {Component} from 'react'
import {InputItem, Toast} from "antd-mobile";
import Super from "./../../super";
import "./index.less"
import Button from "antd-mobile/es/button";
import Units from "../../units";
import $ from "jquery";

class Login extends Component{
    state = {
        username:"",
        password:"",
    }
    componentDidMount() {
        $("meta[name='viewport']").attr("content","width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no")
        $("html").css("background-color","#fff");
    }

    submit=()=>{
        if(this.checkUsername()){
            if(this.checkPassword()){
                let username=this.refs.username_inp.value;
                let password=this.refs.password_inp.value;
                Super.super({
                    url:"api2/auth/token",
                    method:"get",
                    query:{username:username,password:password}
                }).then((res)=>{
                    if(res.status=="504"){
                        Toast.info('服务器连接失败');
                    }
                    else{
                        if(res.status === 'suc'){
                            window.location.hash="#/home";
                            Units.setLocalStorge("tokenName", res.token)
                        }
                        else if(res.status=="error"){
                            Toast.info(res.errorMsg);
                        }
                    }
                });
            }
        }
    }
    checkUsername=()=>{
        let username=this.refs.username_inp.value;
        if(username==""||username==null){
            Toast.info("请输入用户名");
            return false;
        }
        else
            return true;
    }
    checkPassword=()=>{
        let password=this.refs.password_inp.value;
        if(password==""||password==null){
            Toast.info("请输入密码");
            return false;
        }
        else
            return true;
    }

    render(){
        const {username,password}=this.state
        return <div className="loginPage_div">
                <div className="main_div">
                <h1 className="title_h1">人员定位系统手机版</h1>
                <div className="username_div">
                    <span className="iconfont">&#xe74c;</span>
                    <div className="username_inp_div">
                        <input className="username_inp" ref="username_inp" placeholder="请输入用户名"/>
                    </div>
                </div>
                <div className="password_div">
                    <span className="iconfont">&#xe736;</span>
                    <div className="password_inp_div">
                        <input className="password_inp" ref="password_inp" type="password" placeholder="请输入密码"/>
                    </div>
                </div>
                <div className="loginBut_div" onClick={this.submit}>登录</div>
            </div>
        </div>
    }
}
export default createForm()(Login)