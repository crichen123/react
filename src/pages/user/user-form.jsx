import React from "react";
import {Form,Select,Input} from "antd"
import PropTypes from "prop-types"

const Item = Form.Item
const Option = Select.Option

class UserForm extends React.PureComponent{

    static propTypes = {
        roles:PropTypes.array.isRequired,
        setForm:PropTypes.func.isRequired,
        user:PropTypes.object
    }


    componentWillMount() {
        this.props.setForm(this.props.form)
    }



    render(){
        const {roles} = this.props
        const user = this.props.user || {}
        const {getFieldDecorator} = this.props.form

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15},
        };

        return (
            <Form {...formItemLayout}>
                <Item label="用户名">
                    {
                        getFieldDecorator('username',{
                            initialValue:user.username,
                            rules:[
                                {required:true,message:'角色名称必须输入'}
                            ]
                        })(
                          <Input placeholder="清输入角色名称" />
                        )}

                </Item>
                { user._id ? null:   <Item label="密码">
                    {
                        getFieldDecorator('password',{
                            initialValue:user.password,
                            rules:[
                                {required:true,message:'密码必须输入'}
                            ]
                        })(
                            <Input type="password" placeholder="清输入密码" />
                        )}

                </Item>}

                <Item label="手机号">
                    {
                        getFieldDecorator('phone',{
                            initialValue:user.phone,
                            rules:[
                                {required:true,message:'手机号必须输入'}
                            ]
                        })(
                            <Input placeholder="清输入手机号" />
                        )}

                </Item>
                <Item label="邮箱">
                    {
                        getFieldDecorator('email',{
                            initialValue:user.email,
                            rules:[
                                {required:true,message:'邮箱必须输入'}
                            ]
                        })(
                            <Input placeholder="清输入邮箱" />
                        )}

                </Item>
                <Item label="角色">
                    {
                        getFieldDecorator('role_id',{
                            initialValue:user.role_id,
                            rules:[
                                {required:true,message:'角色必须输入'}
                            ]
                        })(
                            <Select>
                                {
                                    roles.map(role=> <Option key={role._id} value={role._id}>{role.name}</Option>)
                                }

                            </Select>
                        )}
                </Item>
            </Form>
        )
    }
}
export default Form.create()(UserForm)