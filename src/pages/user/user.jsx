import React from 'react'
import {Modal, Card, Button, Table, message} from "antd"
import {PAGE_SIZE} from "../../utils/constant";
import {formateDate} from "../../utils/dateUtils";
import LinkButton from "../../components/link-button";
import UserForm from "./user-form";
import {reqGetUsers,reqDeleUser,reqAddUser} from "../../api"

export default class User extends React.Component {

    state = {
        loading:false,
        users:[{
            "username":"text",
            "_id":"548542421",
            "create_time":1554639552758,
            "email":"test@aadfa.conm",
            "phone":"15712548",
            "role_id":"fdsa854854",
            "password":"12312312"
        }],
        roles:[{
            "_id":"fdsa854854",
            "name":"测试"
        }],
        isShow:false,

    }

    initColumn = ()=>{
        this.columns = [{
            title:'用户明',
            dataIndex:"username"
        },{
            title:"邮箱",
            dataIndex: "email"
        },{
            title:"电话",
            dataIndex: "phone"
        },{
            title:"注册时间",
            dataIndex: "create_time",
            render:formateDate
        },{
            title:"所属角色",
            dataIndex: "role_id",
           render:(role_id)=>this.state.roles.find(role=>role._id === role_id).name
           // render:(role_id)=>this.roleNames[role_id]
        },{
            title:"操作",
           render:(user)=>(
            <span>
                <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
                <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
            </span>
           )
        }
        ]
    }

    showUpdate = (user) =>{
        this.user = user
        this.setState({isShow:true})
    }

    showAdd = () =>{
        this.user = null
        this.setState({isShow:true})
    }



    addOrUpdateUser = async() =>{
        this.setState({isshow:false})
        const user = this.form.getFieldsValue()
        this.form.resetFields()
        const result = await  reqAddUser(user);
        if(result.static === 0) {
            message.success("添加成功")
            this.getUsers()
        }

    }

    deleteUser =(user) =>{
        Modal.confirm({
            title:"确定要删除用户"+user.username+"?",
            onOk:async()=>{
                const result =await reqDeleUser(user._id)
                if(result.status === 0){
                    message.success("删除用户成功")
                    this.getUsers()
                }
            }
        })
    }

    initRoleNames = (roles) => {
        const  roleNames = roles.reduce((pre,role)=>{
            pre[role._id] = role.name
            return pre
        },[])
        this.roleNames = roleNames
    }

    getUsers = async() => {
        const result = await reqGetUsers();
        if(result.status === 0){
            const {users,roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users,roles
            })
        }

    }


    componentDidMount() {
        this.initColumn()
        this.getUsers()
    }

    render(){
        const title = (<Button type="primary" onClick={()=>this.showAdd()}>创建用户</Button>);
        const {loading,users,isShow,roles} = this.state
        const user = this.user
        return (

            <Card title={title}>
                <Table
                    bordered
                    rowKey="_id"
                    loadding={loading}
                    dataSource={users}
                    pagination={ {defaultPageSize:5} }
                    columns={this.columns} />
                <Modal
                    title={user?'修改用户':"添加用户"}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={()=>{
                        this.form.resetFields();
                        this.setState({isShow: false})
                    }}
                >
                    <UserForm user={user} setForm={form=>this.form = form} roles={roles}>1111</UserForm>
                </Modal>


            </Card>
        )
    }
}