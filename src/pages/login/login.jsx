import React from "react"
import "./login.less"
import logo from "../../assets/images/logo.png"
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import {reqLogin} from "../../api"
import {message} from "antd"
import memoryUtils from "../../utils/memoryUtils";
import storageUtiles from "../../utils/storageUtiles";
import {connect} from "react-redux"
import { login} from "../../redux/actions"

class Login extends React.Component{


    handleSubmit = e => {
        e.preventDefault();
       this.props.form.validateFields(async (err,values)=>{
           if(!err){
               this.props.login(values.username,values.password)
              const response = await reqLogin(values.username,values.password);
              const result = response.data;
              if(!result.stateus){
                  message.success("login success");
                  memoryUtils.user = {username:"crc",role:{menus:"/product"}}
                  storageUtiles.saveUser({username:"crc"});
                  this.props.history.replace("/admin")
              }
           }else{
               console.log("validate fail")
           }
       })
    };

    validatorPwd = (rule,value,callback)=>{
        if(!value){
            callback("not empty")
        }else if(value.length<6){
            callback("at least 6")
        }else if(value.length>12){
            callback("most 12")
        }else{
            callback()
        }

    }

    render(){
        //const user = memoryUtils.user;
        const user = this.props.user
        console.log(user);

        const { getFieldDecorator } = this.props.form;
         return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React 后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [
                                        { required: true, message: 'Please input your username!' },
                                        { min: 4, message: 'at least 4' },
                                        { max: 12, message: 'most 12' }

                                        ],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Username"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [
                                        { validator:this.validatorPwd}
                                        ],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="Password"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                })(<Checkbox>Remember me</Checkbox>)}
                                <a className="login-form-forgot" href="#">
                                    Forgot password
                                </a>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                                Or <a href="">register now!</a>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}

const WrappedNormalLoginForm = Form.create()(Login);
export default connect(
    state=>({user:state.user}),{login}
)(WrappedNormalLoginForm);