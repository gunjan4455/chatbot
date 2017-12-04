import { combineReducers } from 'redux'
import user from './userReducer';
import room from './roomReducer';
import admins from './adminReducer';
import socket from './socketReducer';

const rootReducer = combineReducers({
    user,
    room,
    socket,
    admins
});

export default rootReducer;
