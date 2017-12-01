import { combineReducers } from 'redux'
import {user, admins} from './userReducer';
import room from './roomReducer';
import socket from './socketReducer';

const rootReducer = combineReducers({
    user,
    room,
    socket,
    admins
});

export default rootReducer;
