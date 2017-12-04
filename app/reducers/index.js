import { combineReducers } from 'redux'
import user from './userReducer';
import onlineUser from './onlineUserReducer';
import room from './roomReducer';
import admins from './adminReducer';
import socket from './socketReducer';

const rootReducer = combineReducers({
    user,
    onlineUser,
    room,
    socket,
    admins,

});

export default rootReducer;
