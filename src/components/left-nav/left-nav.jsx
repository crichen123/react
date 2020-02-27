import React from 'react'
import "./index.less"
import {Link,withRouter} from "react-router-dom"
import { Menu, Icon } from 'antd';
import menuList from '../../config/menuConfig'
import memoryUtils from "../../utils/memoryUtils";
import {connect} from "react-redux"
import {setHeaderTitle} from "../../redux/actions"

const { SubMenu } = Menu;



class LeftNav extends React.Component{
    state = {
        collapsed: false,
    };


    //示例 使用map方法生成条目
    getMenuNodes_map = (menuList) => {
        return menuList.map(item=>{
            if(!item.children){
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                           <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }else{
                return (
                    <SubMenu
                    key={item.key}
                    title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                    }>
                       {this.getMenuNodes(item.children)}
                    </SubMenu>

                )
            }
        })
    }

    hasAuth = (item) =>{
        const {key,isPublic} = item
        const username = memoryUtils.user.username
        const {menus} = memoryUtils.user.role
        if(username ==='crc' || isPublic || menus.indexOf(key) !== -1 ){
            return true
        }else if(item.children){
            return !!item.children.find(child=> menus.indexOf(child.key)!==-1)
        }

    }

    getMenuNodes =(menuList) =>{
        const path = this.props.location.pathname
        return menuList.reduce((pre,item)=>{
            if(this.hasAuth(item)) {
                if (!item.children) {
                    if(item.key === path || path.indexOf(item.key)===0){
                        this.props.setHeaderTitle(item.title)
                    }
                    pre.push((<Menu.Item key={item.key}>
                        <Link to={item.key} onClick={()=>this.props.setHeaderTitle(item.title)}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>))
                } else {
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    // 如果存在, 说明当前item的子列表需要打开
                    if (cItem) {
                        this.openKey = item.key
                    }
                    pre.push((<SubMenu
                        key={item.key}
                        title={
                            <span>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </span>
                        }>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>))
                }
            }
            return pre;
        },[])
    }

    //第一次render之前 只执行一次
    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList);
    }
    render() {
        let path = this.props.location.pathname;
        const openKey = this.openKey
        if(path.indexOf('/product')===0){
            path = "/product"
        }
        return (
            <div   className="left-nav">
                <Link to="/" className="left-nav-header">
                    <h1 style={{marginLeft:"30px"}}>React后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {
                        this.menuNodes
                    }
                </Menu>
                {/*<Menu*/}
                {/*    defaultSelectedKeys={['1']}*/}
                {/*    defaultOpenKeys={['sub1']}*/}
                {/*    mode="inline"*/}
                {/*    theme="dark"*/}
                {/*>*/}
                {/*    <Menu.Item key="/home">*/}
                {/*            <Link to="/home">*/}
                {/*                <Icon type="pie-chart" />*/}
                {/*                <span>首页</span>*/}
                {/*            </Link>*/}
                {/*    </Menu.Item>*/}
                {/*    <SubMenu*/}
                {/*        key="sub1"*/}
                {/*        title={*/}
                {/*            <span>*/}
                {/*                <Icon type="mail" />*/}
                {/*                <span>商品</span>*/}
                {/*            </span>*/}
                {/*            }*/}
                {/*        >*/}
                {/*        <Menu.Item key="/category">*/}
                {/*            <Link to="/category">*/}
                {/*                <Icon type="mail" />*/}
                {/*                <span>品类管理</span>*/}
                {/*            </Link>*/}
                {/*        </Menu.Item>*/}
                {/*        <Menu.Item key="/product">*/}
                {/*            <Link to="/product">*/}
                {/*                <Icon type="mail" />*/}
                {/*                <span>商品管理</span>*/}
                {/*            </Link>*/}
                {/*        </Menu.Item>*/}
                {/*    </SubMenu>*/}
                {/*    <Menu.Item key="/user">*/}
                {/*        <Link to="/user">*/}
                {/*            <Icon type="pie-chart" />*/}
                {/*            <span>用户管理</span>*/}
                {/*        </Link>*/}
                {/*    </Menu.Item>*/}
                {/*    <Menu.Item key="/role">*/}
                {/*        <Link to="/role">*/}
                {/*            <Icon type="pie-chart" />*/}
                {/*            <span>角色管理</span>*/}
                {/*        </Link>*/}
                {/*    </Menu.Item>*/}

                {/*</Menu>*/}
            </div>
        )
    }
}
//leftNav是非路由组件 withRouter传入location history match 属性
export default connect(state=>({}),{setHeaderTitle})(withRouter(LeftNav))