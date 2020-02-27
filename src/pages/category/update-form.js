import React from "react";
import {Form,Select,Input} from "antd"
import PropTypes from "prop-types"
const Item = Form.Item;
class UpdateForm extends React.Component{

    static propTypes = {
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }

    componentWillMount() {
        console.log(222);
        console.log(this.props.form)
        this.props.setForm(this.props.form)
    }

    render(){
        const {categoryName} = this.props
        const {getFieldDecorator} = this.props.form

        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('categoryName',{
                        initialValue:categoryName,
                        rules:[
                            {required:true,message:"不能为控"}
                            ]
                    })(
                            <Input placeholder="请输入分类名称" />
                    )}

                </Item>
            </Form>
        )
    }
}
export default Form.create()(UpdateForm)