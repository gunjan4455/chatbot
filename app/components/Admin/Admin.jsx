import React from "react";
import _ from 'lodash';
import DetailModal from "../shared/DetailModal";
import ConfirmationModal from "../shared/ConfirmationModal";
import BackButton from '../shared/BackButton';

class Admin extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        //this.props.getAdmins();
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.on('greeting-request', function (msg) {
            console.log(msg);
        });
    }

    render() {
        return (
            <div className="col-sm-3 user-listing">
                <ul className="list-group">
                    <li className="list-group-item active">Cras justo odio</li>
                    <li className="list-group-item">Dapibus ac facilisis in</li>
                    <li className="list-group-item">Morbi leo risus</li>
                    <li className="list-group-item">Porta ac consectetur ac</li>
                    <li className="list-group-item">Vestibulum at eros</li>
                </ul>
            </div>
        );
    }
}
export default Admin

