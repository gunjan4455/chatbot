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
    }

    componentDidMount() {
        this.props.getAdmins();

        const {socket} = this.props;
        socket.on('greeting-request', function (msg) {
            console.log(msg);
        });
    }

    render() {
        return (
            <div className="col-sm-3 user-listing">
                <ul className="list-group">
                    <li className="list-group-item active">Admins</li>
                    {this.props.admins && this.props.admins.length && _.map(this.props.admins,(admin, index) => {
                        return  (<li className="list-group-item" key={index}>{admin.name}</li>)
                    }) }

                    <li className="list-group-item">Morbi leo risus</li>
                    <li className="list-group-item">Porta ac consectetur ac</li>
                    <li className="list-group-item">Vestibulum at eros</li>
                </ul>
            </div>
        );
    }
}
export default Admin

