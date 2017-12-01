import React from "react";
import _ from 'lodash';
import DetailModal from "../shared/DetailModal";
import ConfirmationModal from "../shared/ConfirmationModal";
import BackButton from '../shared/BackButton';

class Admin extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.on('greeting-request', function (msg) {
            console.log(msg);
        });
    }

    render() {
        return (<div></div>);
    }
}
export default Admin

