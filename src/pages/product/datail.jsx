import React from 'react'
import {Card,Icon,List} from "antd"
import LinkButton from "../../components/link-button";
import {BASE_IMG_URL} from "../../utils/constant"
import {reqCategory} from "../../api"

const Item = List.Item
export default class ProductDetail extends React.Component {

    state = {
        cName1:'',
        cName2:''
    }

    getCategoryInfo(){

    }

    async componentDidMount() {
        const {pCategoryId,categoryId} = this.props.location.state;

        if(pCategoryId === 0){
            const result1 = await reqCategory(categoryId)
            const cName1 = result1.data.data.name
            this.setState({cName1})
        }else{
            // const result1 = await reqCategory(categoryId)
            // const result2 = await reqCategory(pCategoryId)
            //
            // const cName1 = result1.data.data.name
            // const cName2 =  result2.data.data.name
            const  results = await Promise.all([reqCategory(categoryId),reqCategory(pCategoryId)])
            const cName1 = results[0].data.data.name
            const cName2 = results[1].data.data.name
            this.setState({cName1,cName2})
        }
        this.getCategoryInfo()
    }

    render(){

        const {name,desc,price,detail,imgs} = this.props.location.state
        const {cName1,cName2} = this.state
        const title =(
            <span>
                <LinkButton>
                    <Icon type="arrow-left" style={{color:'green',marginRight:10,fontSize:20}} onClick={()=>this.props.history.goBack()}></Icon>
                </LinkButton>
                <span>商品心情</span>
            </span>
        )

        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="left">商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格:</span>
                        <span>{price}</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        <span>{cName1}-{cName2?'-->'+cName2:''}</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片:</span>
                        <span>
                            {
                                imgs.map(img=>(
                                    <img
                                        key={img+Math.random()}
                                        className="product-img"
                                        src={BASE_IMG_URL+ img}
                                        alt="img"/>
                                ))
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}