import React from "react";

import PropTypes from "prop-types"
import { Upload, Icon, Modal, message } from 'antd';
import {reqDeleteImg} from "../../api"
import {BASE_IMG_URL} from "../../utils/constant"

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default  class PicturesWall extends React.Component {


  static protypes = {
    imgs:PropTypes.array
  }

  constructor(props) {
    super(props);
    let fileList = [];
    const {imgs} = this.props
    if(imgs && imgs.length>0){
      fileList =imgs.map(
          (img,index)=>({
             uid:-index,
             name:img,
             status:'done',
            url:BASE_IMG_URL + img
          }))
    }
    console.log(1111);
    console.log(fileList);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: fileList,
    }
  }

  getImgs = () =>{
    return this.state.fileList.map(file=>file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async({file, fileList }) => {
    if(file.status === 'done'){
      const result = file.response
      if(result.status ===0){
        message.success('上传成功')
        const {name,url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url
      }else{
        message.error("上传失败")
      }
    }else if(file.status === 'removed'){
      const result =await  reqDeleteImg(file.name)
      if(result.status === 0){
        message.success("删除成功")
      }else{
        message.error("删除失败")
      }
    }
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          accept="image/*"
          action="/users/upload"
          listType="picture-card"
          fileList={fileList}
          name="image"
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

