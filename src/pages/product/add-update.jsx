import React from 'react'
import {Card,Form,Input,Cascader,Button,Icon,message} from "antd"
import LinkButton from "../../components/link-button";
import {reqCategorys} from "../../api"
import category from "../category/category";
import PicturesWall from "./Pictures-wall";
import RichTextEditor from "./rich-text-editor";
import {reqAddOrUpdateProduct} from "../../api/index"

const {Item} = Form
const {TextArea} = Input

const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        isLeaf: false,
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        isLeaf: false,
    },
    {
        value: 'jiangsu2',
        label: 'Jiangsu2',
        isLeaf: true,
    },
];

class ProductAddUpdate extends React.Component {

    state = {
        options:[],
    };

    constructor(props) {
        super();
        this.pw = React.createRef()
        this.editor =React.createRef()
    }

    submit = () =>{
        this.props.form.validateFields(async (err,values)=>{
            if(!err){
                const {name,desc,price,categoryIds} =values
                let pCategoryId,categoryId
                if(categoryIds.length ===1){
                    pCategoryId = '0'
                    categoryId =categoryIds[0]
                }else{
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }

                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const product = {name,desc,price,imgs,detail,pCategoryId,categoryId}
                if(this.isUpdate){
                    product._id = this.product._id
                }
                const result = await reqAddOrUpdateProduct(product)
                if(result.status === 0){
                    message.success(`${this.isUpdate}? '更新:'添加'商品成功!`)
                    this.props.history.goBack()
                }else{
                    message.error(`${this.isUpdate}? '更新:'添加'商品失败!`)
                }
            }
        })
    }

    validattorPrice = (rule,value,callback) =>{
        if(value*1>0){
            callback()
        }else{
            callback("价格格式不对")
        }

    }

    getCategory = async(parentId) =>{
        const result  = await reqCategorys(parentId)
        console.log(result.data.status);
        if(result.data.status === "0"){
            const categorys = result.data.data
            if(parentId === "0"){
                this.initOptions(categorys)
            }else{
                return categorys
            }

        }
    }

    initOptions =async (catagerys) =>{
       const options = catagerys.map(c=>({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        const {isUpdate,product} = this
        const {pCategoryId,categoryId} =product
        if(isUpdate && pCategoryId !== '0'){
           const subCategorys = await this.getCategory(pCategoryId)
            const childOptions = subCategorys.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf: false,
            }))
            const targetOption = options.find(option=>option.value == pCategoryId)
            targetOption.children = childOptions

        }
        console.log(options)
        this.setState({
            options
        })

    }


    loadData =  async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;

        const subCategory =  await this.getCategory(targetOption.value)
        targetOption.loading = false;
        if(subCategory && subCategory.length>0){
               const childOptions = subCategory.map(c=>({
                    value: c._id,
                    label: c.name,
                    isLeaf: true,
                }))
            targetOption.children = childOptions
        }else{
            targetOption.isLeaf = true;
        }
        // setTimeout(() => {
        //     targetOption.loading = false;
        //     targetOption.children = [
        //         {
        //             label: `${targetOption.label} Dynamic 1`,
        //             value: 'dynamic1',
        //         },
        //         {
        //             label: `${targetOption.label} Dynamic 2`,
        //             value: 'dynamic2',
        //         },
        //     ];
            this.setState({
                options: [...this.state.options],
            });
        // }, 1000);
    };


    componentDidMount() {
        this.getCategory('0')
    }

    componentWillMount() {
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}
    }


    render(){
        const {getFieldDecorator } = this.props.form
        const {isUpdate,product} = this
        const {pCategoryId,categoryId,imgs,detail} = product
        const categoryIds = [];

        if(isUpdate){
            if(pCategoryId === '0'){
                categoryIds.push(categoryId)
            }else{
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }

        }

        const title = (
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                    <Icon type="arrow-left" style={{fontSize:20}}/>
                </LinkButton>
                <span>{isUpdate?'修改商品':'添加商品'}</span>
            </span>
        )

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8},
        };


        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称:">
                        {
                            getFieldDecorator('name',{
                                initialValue:product.name,
                                rules:[
                                    {required:true,message:"请输入商品名称"}
                                ]
                            })(
                                <Input placeholder="商品名称"></Input>
                            )
                        }
                    </Item>
                    <Item label="商品描述:">
                        {
                            getFieldDecorator('desc',{
                                initialValue:product.desc,
                                rules:[
                                    {required:true,message:"请输入商品描述"}
                                ]
                            })(
                                <TextArea  placeholder="商品描述" autoSize ={{minRows:2}} />
                            )
                        }

                    </Item>
                    <Item label="商品价格:">
                        {
                            getFieldDecorator('price',{
                                initialValue:product.price,
                                rules:[
                                    {required:true,message:"请输入商品描述"},
                                    {validator:this.validattorPrice}
                                ]
                            })(
                                <Input type="number" addonAfter="元" placeholder="商品价格"></Input>
                            )
                        }
                    </Item>
                    <Item label="商品分类:">
                        <div>商品分类</div>
                    </Item>
                    <Item label="商品分类:">
                        {
                            getFieldDecorator('categoryIds',{
                                initialValue:categoryIds,
                                rules:[
                                    {required:true,message:"请输入商品分类"}
                                ]
                            })(
                                <Cascader
                                    options={this.state.options}
                                    loadData={this.loadData}
                                    onChange={this.onChange}
                                    changeOnSelect
                                />
                            )
                        }


                    </Item>
                    <Item label="商品图片:">
                        <PicturesWall  ref={this.pw} imgs ={imgs} />
                    </Item>
                    <Item label="商品详情:" labelCol={{ span: 2 }} wrapperCol={{ span: 20}}>
                        <RichTextEditor  ref={this.editor} detail={detail} />
                    </Item>

                    <Item>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate);