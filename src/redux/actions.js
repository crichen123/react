import {SET_HEAD_TITLE,RECEIVE_USER,SHOW_ERROR_MSG} from "./action-types";
import {reqLogin} from "../api";
import storageUtiles from "../utils/storageUtiles"

export const setHeaderTitle = (headTitle) =>({type:SET_HEAD_TITLE,data:headTitle})

export const receiveUser = (user) => ({type:RECEIVE_USER,user})

export const showErrorMsg = (errorMsg) => ({type:SHOW_ERROR_MSG,errorMsg})

export const login = (username,password) => {
    return async dispatch=>{
        const result = await reqLogin(username,password)
        if(result.data.status === 0) {
            const user = result.data.user
            storageUtiles.saveUser(user)
            dispatch(receiveUser(user))
        }else{
            const msg = result.data.msg
            dispatch(showErrorMsg(msg))
        }

    }
}