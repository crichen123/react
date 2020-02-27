import React from "react";
import {Form,Select,Input} from "antd"
import PropTypes from "prop-types"

const Item = Form.Item

class AddForm extends React.Component{

    static propTypes = {
        setForm:PropTypes.func.isRequired,
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render(){
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15},
        };

        return (
            <Form {...formItemLayout}>
                <Item>
                    {
                        getFieldDecorator('roleName',{
                            initialValue:'',
                            rules:[
                                {required:true,message:'角色名称必须输入'}
                            ]
                        })(
                          <Input placeholder="清输入角色名称" />
                        )}

                </Item>

            </Form>
        )
    }
}
export default Form.create()(AddForm)