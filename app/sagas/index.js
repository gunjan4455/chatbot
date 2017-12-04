import {delay} from "redux-saga";
import {call,put,takeEvery,all,race,take,select} from "redux-saga/effects";
import apiCall from '../api/apiRequest';
import endPoints from '../api/endPoints';
import * as types from '../api/constant';
import io from 'socket.io-client';

export function* addNewUser(action) {
    try {
        const data = yield call(apiCall, {
            method: 'post',
            endpoint: endPoints.user,
            payload: action.user
        });
        console.log("in saga", data.result);
        yield put({type: types.ADD_USER, user: data.result.user});
    } catch(err) {
        console.log("error",err);
    }
}

export function* createChatRoom(action) {
    try {
        const data = yield call(apiCall, {
            method: 'post',
            endpoint: endPoints.room,
            payload: action.room
        });

        yield put({type: types.NEW_CHAT_ROOM, room: data.result.room});
    } catch(err) {
        console.log("error",err);
    }
}
export function* getAdmins() {
    try {
        const data = yield call(apiCall, {
            method: 'get',
            endpoint: endPoints.admins
        });
        console.log("in saga admins==", data);
       yield put({type: types.GET_ADMINS, admins: data.result.admins});

    } catch(err) {
        console.log("error",err);
    }
}

export function* getSocket() {
    try {
        const socket = io('http://localhost:9000');
        yield put({type: types.GET_SOCKET, socket: socket});
    } catch(err) {
        console.log("error",err);
    }
}

export function* editBookByIdAsync(action) {
    try {
        const endpoint = `${endPoints.book}/${action.id}`;
        const book = yield call(apiCall, {
            method: 'put',
            endpoint: endpoint,
            payload: action.formData
        });
        yield put({type: types.EDIT_BOOK, book: book});
        yield put({type: types.CHECK_SUCCESS, check: true});
    } catch(err) {
        console.log("error",err);
    }
}

export function* watchGetSocket() {
    yield takeEvery(types.GET_SOCKET_ASYNC, getSocket)
}

export function* watchAddUser() {
    yield takeEvery(types.ADD_USER_ASYNC, addNewUser)
}

export function* watchGetAdmins() {
    yield takeEvery(types.GET_ADMINS_ASYNC, getAdmins)
}

export function* watchCreateRoom() {
    yield takeEvery(types.NEW_CHAT_ROOM_ASYNC, createChatRoom)
}

export default function* rootSaga() {
    yield all([
        watchGetSocket(),
        watchAddUser(),
        watchGetAdmins(),
        watchCreateRoom()
    ])
}