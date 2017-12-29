import React, {Component} from 'react';

class UserList extends React.PureComponent {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <li onClick={this.props.acceptRequest} className="list-group-item">{this.props.onlineUserName}<span  className="glyphicon-one-fine-yellow-dot"></span></li>        )
    }
}

export default UserList;


