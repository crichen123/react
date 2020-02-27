import React from "react";
import {Form,Select,Input} from "antd"
import PropTypes from "prop-types"
import category from "./category";

const Item = Form.Item;
const Option = Select.Option;
class AddForm extends React.Component{

    static propTypes = {
        setForm:PropTypes.func.isRequired,
        categorys : PropTypes.array.isRequired,
        parentId:PropTypes.string.isRequired
    }

    componentWillMount() {
        console.log(222);
        console.log(this.props.form)
        this.props.setForm(this.props.form)
    }

    render(){
        const {getFieldDecorator} = this.props.form
        const {categorys,parentId} = this.props
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId',{
                        initialValue:parentId
                    })(
                        <Select>
                            <Option value='0'>一级分类</Option>
                            {
                                categorys.map(c=><Option value={c._id}>{c.name}</Option>)
                            }
                        </Select>
                    )}

                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName',{
                        initialValue:''
                    })(
                        <Input placeholder="请输入分类名称" />
                    )
                    }

                </Item>

            </Form>
        )
    }
}
export default Form.create()(AddForm)