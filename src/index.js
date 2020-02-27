import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import storageUtiles from "./utils/storageUtiles";
import memoryUtils from "./utils/memoryUtils";
import {Provider} from "react-redux"
import store from "./redux/store"


const user = storageUtiles.getUser()
memoryUtils.user = user;

ReactDOM.render((<Provider store={store}><App /></Provider>), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

