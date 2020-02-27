import React from 'react'
import "./index.less"
import {formateDate} from "../../utils/dateUtils"
import memoryUtils from "../../utils/memoryUtils";
import storageUtiles from "../../utils/storageUtiles";
import {reqWeather} from "../../api";
import {withRouter} from 'react-router-dom'
import menuList from "../../config/menuConfig";
import { Modal} from 'antd';
import LinkButton from "../link-button";
import {connect} from "react-redux"

class HeaderContent extends React.Component{
    state = {
        currentTime:formateDate(Date.now()),
        dayPictureUrl:'',
        weather:''
    }

    getTime=()=>{
        this.intervalId = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather = async() => {
        const {dayPictureUrl,weather} = await reqWeather('西安')
        this.setState({dayPictureUrl,weather})
    }

    getTitle = () =>{
        let title;
        const path = this.props.location.pathname
        menuList.forEach(item=>{
            if(item.key===path){
               title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0);
                if(cItem){
                    title = cItem.title;
                }
            }
        })
        return title;
    }

    Logout= () =>{
        Modal.confirm({
            content: '确定退出吗？',
            onOk : () => {
                console.log('OK');
                storageUtiles.removeUser();
                memoryUtils.user = {};
                this.props.history.replace('/login')
            },

        })
    }

    componentDidMount() {
        this.getTime();
        this.getWeather()
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        const {currentTime,dayPictureUrl,weather} = this.state
        const user = memoryUtils.user.username;
        //const title = this.getTitle();
        const title = this.props.headTitle
        return (
            <div className="header">
               <div className="header-top">
                   <span>欢迎，{user}</span>
                   <LinkButton onClick={this.Logout}>退出</LinkButton>
               </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img alt="daypicture" src={dayPictureUrl} />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default  connect(
    state=>({headTitle:state.headTitle}),{}
)(withRouter(HeaderContent))