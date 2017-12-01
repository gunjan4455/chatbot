import React from 'react';
import { connect } from 'react-redux';
import WrapperComponent from "../components/shared/Wrapper/wrapper"

import { addNewUser, createChatRoom, getSocket } from '../actions';
const mapStateToProps = (state,ownProps) => {
return {};
};

const mapDispatchToProps = dispatch => ({
    getSocket: (socket) => dispatch(getSocket(socket))
});

const Wrapper = connect(mapStateToProps,mapDispatchToProps)(WrapperComponent);
export default Wrapper;
