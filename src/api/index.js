import ajax from "./ajax";
import jsonp from "jsonp"
import {message} from "antd"


export const reqLogin = (username,password) =>
        ajax("/users",{username,password},"POST")

export const reqAddUser = (user) => ajax("/users/add",user,"POST")

export const reqWeather = (city) =>{
    return new Promise((resolve ,reject)=>{
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        jsonp(url,{},(err,data)=>{
            if(!err && data.status==='success'){
                const {dayPictureUrl,weather} = data.results[0].weather_data[0];
                resolve({dayPictureUrl,weather})
            }else{
                message.error('获取天气信息失败')
            }
        })
    })
}

export const reqCategorys = (parentId) =>ajax("/users/categorys",{parentId},"GET")

export const reqAddCategorys = (categoryName,parentId) =>ajax("/users/addcategorys",{categoryName,parentId},"POST")

export const reqUpdateCategorys = (categoryId,categoryName) =>ajax("/users/updatecategorys",{categoryId,categoryName},"POST")

export const reqProducts = (pageNum,pageSize) =>ajax("/users/productslist",{pageNum,pageSize})

export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) =>ajax("/users/productsearch",{pageNum,pageSize,[searchType]:searchName})

export const reqCategory = (categoryId) =>ajax("/users/categoryinfo",{categoryId})

export const reqUpdateStatus = (productId,status) =>ajax("/users/updatestatus",{productId,status},"POST")

export const reqDeleteImg = (name) =>ajax("/users/deleteimg",{name},"POST")

export const reqAddOrUpdateProduct = (product) => ajax("/users/product"+(product._id?'update':'add'),product,"POST")

export const reqUpdateRole = (role) => ajax("/users/updaterole",role,"POST")

export const reqGetUsers = () =>ajax("/users/getAll")

export const reqDeleUser = (userId) =>ajax("/user/delete",{userId},"POST")


