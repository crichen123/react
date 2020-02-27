import React from 'react'
import {Button, Table, Card, Modal,message} from "antd"
import {PAGE_SIZE} from "../../utils/constant";
import AddForm from "./add-form";
import AuthForm from "./auth-form";
import {reqAddUser,reqUpdateRole} from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import {formateDate} from "../../utils/dateUtils";
import storageUtiles from "../../utils/storageUtiles";

export default class Role extends React.Component {
    state = {
        roles:[{
            "menus":[
                "/home",
                "/products",
                "/category",
                "/product",
                "/role"
            ],
            "_id":"5ca9eac0",
            "name":"角色1",
            "create_time":1554639552758,
            "_v":0,
            "auth_time":1557630307021,
            "auth_name":"admim"
        }],
        loading:false,
        role:{},
        isShowAdd:false,
        isShowAuth:false
    }

    constructor(props) {
        super(props);
        this.auth = React.createRef()
    }

    initColumn = () =>{
        this.columns = [
            {
                title:'角色名称',
                dataIndex:'name'
            }, {
                title:'创建时间',
                dataIndex:'create_time',
                render:(creat_time)=>formateDate(creat_time)
            },{
                title:'授权时间',
                dataIndex:'auth_time',
                render:formateDate
            },{
                title:'授权人',
                dataIndex:'auth_name'
            },
        ]
    }

    addRole =() =>{
        this.form.validateFields(async(err,values)=>{
            if(!err){
                this.setState({isShowAdd:false})
                const {roleName} = values
                this.form.resetFields()
                const result = await reqAddUser(roleName)
                if(result.status===0){
                    message.success("添加陈宫")
                    const role = result.data
                    this.setState(state=>({
                        roles:[...state.roles,role]
                    }))

                }else{
                    message.error("添加失败")
                }
            }
        })
    }

    updateRole = async() =>{
        this.setState({
            isShowAuth:true
        })
        const role = this.state.role
        const menus = this.auth.current.getMenus
        role.menus = menus
        role.auth_name = memoryUtils.user.username
        role.auth_time = Date.now()
        const result = await reqUpdateRole(role)
        if(result.state===0){
            message.success("设置角色权限成功")
            if(role._id == memoryUtils.user.role._id){
                memoryUtils.user ={}
                storageUtiles.removeUser()
                this.props.history.replace('/login')
            }
            this.setState({
                roles:[...this.state.roles]
            })
        }else{
            message.error("设置角色失败")
        }

    }

    handleCancel =()=>{
        this.setState({isShowAdd:false})
        this.form.resetFields()
    }

    handleCancelAuth =()=>{
        this.setState({isShowAuth:false})

    }

    onRow = (role)=>{
        return {
            onClick : event=>{
                this.setState({
                    role
                })
            }
        }
    }


    componentWillMount(){
        this.initColumn()
    }

    // componentWillReceiveProps(nextProps, nextContext) {
    //     console.log(nextProps.role);
    //    // const menus = nextProps.role.menus
    //    // this.state.checkedKeys = menus
    // }


    render(){
        const {roles,loading,role,isShowAdd,isShowAuth} = this.state

        const title=(
            <span>
                    <Button type="primary" onClick={()=>this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
                    <Button type="primary" disabled={!role._id} onClick={()=>this.setState({isShowAuth: true})}>设置角色权限</Button>
            </span>
        )

        const rowSelection = ({
            type:'radio',
            selectedRowKeys:[role._id],
            onSelect:(role)=>{
                this.setState({
                    role
                })
            }
        })



        return (
            <Card title={title} >
                <Table
                    bordered
                    rowKey="_id"
                    loadding={loading}
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize:5}}
                    rowSelection={rowSelection}
                    onRow={this.onRow}
                 />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddForm  setForm={(form)=> {this.form = form} } />
                </Modal>

                <Modal
                    title="设置权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={this.handleCancelAuth}
                >
                    <AuthForm ref={ this.auth} role={role} />
                </Modal>
            </Card>
        )
    }
}