import { combineReducers } from 'redux'
import user from './userReducer';
import room from './roomReducer';
import socket from './socketReducer';

const rootReducer = combineReducers({
    user,
    room,
    socket
});

export default rootReducer;
