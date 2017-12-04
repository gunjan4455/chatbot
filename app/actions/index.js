import * as types from '../api/constant';

export const createChatRoom = (room) => {
    return {
        type: types.NEW_CHAT_ROOM_ASYNC,
        room : room
    }
};

export const getSocket = (socket) => {
    return {
        type: types.GET_SOCKET_ASYNC,
        socket: socket
    }
};

export const isSuccess = (check) => {
    return {
        type: types.CHECK_SUCCESS,
        check:check
    }
};

export const addNewUser = (user) => {
    return {
        type: types.ADD_USER_ASYNC,
        user:user
    }
};

export const getAdmins = () => {
    return {
        type: types.GET_ADMINS_ASYNC
    }
};

