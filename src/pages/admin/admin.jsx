import React from "react"
import memoryUtils from "../../utils/memoryUtils";
import { Redirect,Route,Switch } from "react-router-dom";
import {Layout} from "antd"
import LeftNav from "../../components/left-nav/left-nav";
import  HeaderContent from "../../components/header/header";
import Home from "../home/home"
import Category from "../category/category";
import Role from "../role/role";
import User from "../user/user";
import Bar from "../chars/bar";
import Line from "../chars/line";
import Pie from "../chars/pie";
import Product from "../product/product";

const {Footer,Sider,Content} =Layout

export default class Admin extends React.Component{
    render(){
        const user = memoryUtils.user
        console.log(user)
        if(!user || !user.username){
            //this.props.history.replace("/login")
            return <Redirect to='/login' />
        }
        return (
            <Layout style={{minHeight:'100%'}}>
                <Sider><LeftNav /></Sider>
                <Layout>
                    <HeaderContent>Header</HeaderContent>
                    <Content style={{margin:'20px',backgroundColor:'#fff'}}>
                        <Switch>
                            <Route path="/home" component={Home} />
                            <Route path="/category" component={Category} />
                            <Route path="/product" component={Product} />
                            <Route path="/role" component={Role} />
                            <Route path="/user" component={User} />
                            <Route path="/charts/bar" component={Bar} />
                            <Route path="/charts/pie" component={Pie} />
                            <Route path="/charts/line" component={Line} />
                            <Redirect to="/home" />
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}