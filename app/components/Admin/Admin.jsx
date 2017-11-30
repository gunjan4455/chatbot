import React from "react";
import _ from 'lodash';
import DetailModal from "../shared/DetailModal";
import ConfirmationModal from "../shared/ConfirmationModal";
import BackButton from '../shared/BackButton';
import io from 'socket.io-client';

const socket = io('http://localhost:9000');

class Admin extends React.Component {
    constructor(props) {
        super(props);
        socket.on('greeting-request', function (msg) {
            console.log(msg);
        });

    }

    componentWillMount() {

    }

    componentWillReceiveProps() {
        socket.on('greeting-request', function (msg) {
            console.log(msg);
        });
    }
    render() {
        return (<div></div>);
    }
}
export default Admin

