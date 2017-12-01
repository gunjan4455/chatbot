import initialState from './initialState';
import * as types from '../api/constant';

export function user(state = initialState.user, action){
    switch(action.type){
        case types.ADD_USER:
            const newState = action.user;
            return newState;
        default:
            return state
    }
}

export function admins(state = initialState.admins, action){
    switch(action.type){
        case types.GET_ADMINS:
            const newState = action.admins;
            return newState;
        default:
            return state
    }
}
