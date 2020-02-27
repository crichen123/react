import React from 'react'
import {Card,Table,Button,Icon,message,Modal} from "antd"
import "./category.less"
import LinkButton from "../../components/link-button";
import {reqAddCategorys, reqCategorys, reqUpdateCategorys} from "../../api"
import AddForm from "./add-form";
import UpdateForm from "./update-form";

export default class Category extends React.Component {

    state = {
        categorys:[],
        loading:false,
        parentId:'0',
        parentName:'',
        subCategorys:[],
        showStatus:0
    }

    initColumns = () =>{
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                width:300,
                dataIndex: '',
                key: 'x',
                render:(category)=>(<span>
                    <LinkButton onClick={()=>this.showUpdate(category)}>修改分类</LinkButton>
                    {this.state.parentId ==='0'
                        ?<LinkButton onClick={()=>this.showSubCategorys(category)}>查看子分类</LinkButton>
                        :null}

                </span>)
            }

        ];
    }

    showSubCategorys=(category)=>{
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{
            this.getCategorys()
        })

    }

    showCategorys = () =>{
        this.setState({parentId:"0",parentName:'',subCategorys:[]},()=>{
            console.log(this.state)
        })
    }

    getCategorys = async () =>{
       this.setState({loading:true});
       const {parentId} = this.state;
       const result = await reqCategorys(parentId);
        this.setState({loading:false});
       if(result.data.status=="0"){
            const categorys = result.data.data;
            console.log(categorys);
            if(parentId==='0'){
                this.setState({categorys});
            }else{
                this.setState({subCategorys:categorys})
            }


       }else{
           message.error("获取分类失败")
       }
    }

    showAdd = () =>{
        this.setState({
            showStatus:1
        })
    }

    showUpdate = (category) =>{
        this.category = category
        this.setState({
            showStatus:2
        })
    }

    addCategory = async() =>{
        this.setState({
            showStatus:0
        })
        const {parentId,categoryName} = this.form.getFieldsValue()
        this.form.resetFields()
        const result = await reqAddCategorys(categoryName,parentId)
        if(result.data.status===0){
            this.getCategorys()
        }
    }

    updateCategory = () =>{
        this.form.validateFields(async(err,value)=>{
            if(!err){
                this.setState({
                    showStatus:0
                })
                const categoryId = this.category._id
                //const categoryName = this.form.getFieldValue('categoryName')
                const {categoryName} = value
                this.form.resetFields()
                console.log(111111);
                console.log(categoryId);
                console.log(categoryName);
                const  reusult = await reqUpdateCategorys(categoryId,categoryName);
                this.getCategorys()
            }
        })

    }

    handleCancel = () =>{
        this.form.resetFields()
        this.setState({showStatus:0})
    }

    componentWillMount() {
        this.initColumns();
    }

    componentDidMount() {
        this.getCategorys();
    }

    render(){
        const {categorys,loading,subCategorys,parentId,parentName} = this.state;
        const columns = this.columns
        const category = this.category || {}
        const title = parentId ===0?"一级分类列表":(
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type="arrow-right"></Icon>
                <span>{parentName}</span>
            </span>);
        const extra = (
            <Button type="primary" onClick={this.showAdd}>
                <Icon type="plus"/>添加
            </Button>
        )

        const dataSource = [
            {
                "parentId": '0',
                "_id": '5ca9d69',
                "name": '家用电器',
                "_v":0
            },{
                "parentId": '0',
                "_id": '5ca9d6c',
                "name": '电脑',
                "_v":0
            },{
                "parentId": '0',
                "_id": '5ca9d7c',
                "name": '图书',
                "_v":0
            },{
                "parentId": '0',
                "_id": '5ca9dbe',
                "name": '服装',
                "_v":0
            }

        ];



        /*
        return (
            <Card title={title} extra={extra}>
                <Table
                    rowKey="_id"
                    bordered
                    dataSource={dataSource} columns={columns} />;
            </Card>
        )
        *
         */

        return (
            <Card title={title} extra={extra}>
                <Table
                    rowKey="_id"
                    bordered
                    dataSource={parentId==='0'?categorys:subCategorys}
                    columns={columns}
                    pagination={{defaultPageSize:5}}
                    loading={loading}
                />

                <Modal
                    title="添加分类"
                    visible={this.state.showStatus===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm categorys={categorys} parentId={parentId} setForm={(form)=> {this.form = form} } />
                </Modal>

                <Modal
                    title="更新分类"
                    visible={this.state.showStatus===2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                   <UpdateForm categoryName={category.name}
                               setForm={(form)=> {this.form = form} } />
                </Modal>

            </Card>

        )
    }
}