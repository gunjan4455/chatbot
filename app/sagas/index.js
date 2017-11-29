import {delay} from "redux-saga";
import {call,put,takeEvery,all,race,take,select} from "redux-saga/effects";
import apiCall from '../api/apiRequest';
import endPoints from '../api/endPoints';
import * as types from '../api/constant';

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
export function* getAdmins() {
    try {
        const admins = yield call(apiCall, {
            method: 'get',
            endpoint: endPoints.admin
        });
        yield put({type: types.GET_ADMINS, admins: admins});

    } catch(err) {
        console.log("error",err);
    }
}

export function* getBookByIdAsync(obj) {
    try {
        const endpoint = `${endPoints.book}/${obj.id}`;
        const book = yield call(apiCall, {
            method: 'get',
            endpoint: endpoint
        });
        yield put({type: types.GET_BOOK_BY_ID, book: book});
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

export function* watchAddUser() {
    yield takeEvery(types.ADD_USER_ASYNC, addNewUser)
}

export function* watchGetAdmins() {
    yield takeEvery(types.GET_ADMINS_ASYNC, getAdmins)
}

export function* watchEditBook() {
    yield takeEvery(types.EDIT_BOOK_ASYNC, editBookByIdAsync)
}

export default function* rootSaga() {
    yield all([
        watchAddUser(),
        watchGetAdmins(),
        watchEditBook()
    ])
}