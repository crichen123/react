import React from 'react'
import {Table,Card,Select,Input,Button,Icon,message} from "antd"
import LinkButton from "../../components/link-button";
import {reqProducts,reqSearchProducts,reqUpdateStatus} from "../../api";
import {PAGE_SIZE} from "../../utils/constant";

const Option = Select.Option;

export default class ProductHome extends React.Component {

    state = {
        products:[],
        total:0,
        loading:false,
        searchName:'',
        searchType:'productName'

    }

    initColumns = () =>{
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'age',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price)=>"￥"+price,
            }, {
                width:100,
                title: '状态',
                render: (product)=>{
                    const {status,_id} = product
                    return (
                        <span>
                            <Button
                                type="primary"
                                onClick={()=>this.updateStatus(status===0?1:0,_id)}
                            >
                                {status===1?'下架':'上架'}
                            </Button>
                        <span>{status===1?'在售':'已下架'}</span>
                    </span>)
                },
            },{
                width:100,
                title: '操作',
                render: (product)=>{
                    return (
                        <span>
                            <LinkButton onClick={()=>this.props.history.push("/product/detail",product)}>详情</LinkButton>
                            <LinkButton onClick={()=>this.props.history.push("/product/addupdate",product)}>修改</LinkButton>
                    </span>)
                },
            },
        ];
    }

    updateStatus = async(status,_id)=>{
        const result = await reqUpdateStatus(_id,status);
        if(result.data.status===0){
            message.success("更新成功")
            this.getProducts(this.pageNum)
        }
    }

    getProducts = async(pageNum) =>{
        this.pageNum = pageNum;
        this.setState({loading:true})
        const {searchName,searchType} = this.state
        let result;
        if(searchName){
             result = await  reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{
            result = await reqProducts(pageNum,PAGE_SIZE);
        }

        this.setState({loading:false})
        console.log(result.data);
        if(result.data.status === 0){
            const {total,list} = result.data.data;
            this.setState({
                total,
                products:list
            })
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render(){
        const {products,total,loading,searchName,searchType} = this.state;

        const title = (
            <span>
                <Select value={searchType} style={{width:150}} onChange={value=>this.setState({searchType: value})}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input placeholder="关键字"
                       style={{width:150,margin:'0 15px'}}
                       value={searchName}
                       onChange={event=>this.setState({searchName:event.target.value})} />
                <Button type="primary" onClick={()=>this.getProducts(1)}>搜索</Button>
            </span>);

        const extra = (
            <Button type="primary" onClick={()=>this.props.history.push("/product/addupdate")}>
            <Icon type="plus"></Icon>
            添加商品
        </Button>);





        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey="_id"
                    loadding={loading}
                    dataSource={products}
                    pagination={
                        {
                            total:total,
                            defaultPageSize:PAGE_SIZE,
                            onChange:this.getProducts
                        }
                    }
                    columns={this.columns} />
            </Card>
        )
    }
}