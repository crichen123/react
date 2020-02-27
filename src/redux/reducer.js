import {combineReducers} from "redux"
import storageUtiles from "../utils/storageUtiles";
import {SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG} from "./action-types"

function headTitle (state = '首页',action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

const initUser = storageUtiles.getUser()

function user (state = initUser,action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR_MSG:
            const errorMsg = action.errorMsg
            return {...state,errorMsg}
        default:
            return state
    }
}

export default combineReducers({headTitle,user})