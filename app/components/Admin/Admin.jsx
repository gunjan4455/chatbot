import React from "react";
import _ from 'lodash';
import Notification from "../shared/Notification";
import UserList from "../shared/UserList";
import ChatBotAdmin from "../shared/ChatBotAdmin";

class Admin extends React.Component {

    acceptRequest = (e) => { //accepting request from client
        e.preventDefault();
        const {socket} = this.props;
        socket.emit('accept-greeting-request', {room: this.state.room, user: this.props.user});
        let chats = this.state.chatRooms;
        let userList = this.state.userList;
        userList.push(this.state.userName);
        chats.push(this.state.room);
        this.setState({chatRooms: chats, greetingMessage: "", userList: userList});
    }

    onHideModal = (e) => {
        if (e)
            e.preventDefault();
        this.setState({greetingMessage: ''});
    }

    chats = () => {
        let rooms = _.map(this.state.chatRooms, (room, index) => {
            return (
                <ChatBotAdmin key={index}
                              userName={this.state.userList[index]} room={room} user={this.props.user} {...this.props}
                              from="admin"/>
            )
        });
        return rooms;
    }

    constructor(props) {
        super(props);
        this.state = {
            greetingMessage: "",
            chatRooms: [],
            room: {},
            messages: [],
            userList: [],
            userName: ''
        };
        this.chatRequests = [];
    }

    componentWillMount() {
        this.props.getOnlineUsers();
        this.props.getAdmins();

    }

    componentDidMount() {
        const {socket} = this.props;
        const self = this;
        socket.on('greeting-request', function (data) {
            //self.chatRequests.unshift(room);
            data.room.messages = [];
            self.setState({
                greetingMessage: data.room.message,
                room: data.room,
                userName: data.userName
            });
            self.props.getOnlineUsers();
        });

        socket.on('refresh-admin-list', function () {
            //self.chatRequests.unshift(room);
            console.log("admin logggggggggg");

        });
    }
    render() {
        let rooms = this.chats();
        return (
            <div className="container">

                {this.state.greetingMessage &&
                <Notification room={this.state.room} onHideModal={this.onHideModal}/>}
                <div className="row well">
                    <div className="col-md-2">
                        <ul className="nav nav-pills nav-stacked well">
                            <li className="active"><a><i className="fa fa-envelope"></i>Online</a></li>
                            {this.props.onlineUsers && this.props.onlineUsers.length && _.map(this.props.onlineUsers, (onlineUsers, index) => {
                                return (
                                    <UserList acceptRequest={this.acceptRequest} className="list-group-item" key={index}
                                              onlineUserName={onlineUsers.name}></UserList>)
                            })}
                        </ul>
                    </div>
                    <div className="col-md-8">
                        <div className="panel">
                            <img className="pic img-circle" src="http://placehold.it/120x120" alt="..."/>

                            <div className="name">
                                <small>Apple K, India</small>
                            </div>
                            <a href="#" className="btn btn-xs btn-primary pull-right" style={{"margin": "10px"}}><span
                                className="glyphicon glyphicon-picture"></span> Change cover</a>
                        </div>

                        <br/><br/><br/>
                        <ul className="nav nav-tabs" id="myTab">
                            <li className="active"><a href="#inbox" data-toggle="tab"><i
                                className="fa fa-envelope-o"></i> Inbox</a></li>
                            <li><a href="#sent" data-toggle="tab"><i className="fa fa-reply-all"></i> Sent</a></li>
                            <li><a href="#assignment" data-toggle="tab"><i className="fa fa-file-text-o"></i>
                                Assignment</a></li>
                            <li><a href="#event" data-toggle="tab"><i className="fa fa-clock-o"></i> Event</a></li>
                        </ul>

                        <div className="tab-content">
                            <div className="tab-pane active" id="inbox">
                                <a type="button" data-toggle="collapse" data-target="#a1">
                                    <div className="btn-toolbar well well-sm" role="toolbar" style={{"margin": "0px"}}>
                                        <div className="btn-group"><input type="checkbox"/></div>
                                        <div className="btn-group col-md-3">Admin Kumar</div>
                                        <div className="btn-group col-md-8"><b>Hi Check this new Bootstrap
                                            plugin</b>

                                            <div className="pull-right"><i className="glyphicon glyphicon-time"></i>
                                                12:10 PM
                                                <button className="btn btn-primary btn-xs" data-toggle="modal"
                                                        data-target=".bs-example-modal-lg"><i
                                                    className="fa fa-share-square-o"> Reply</i></button>
                                            </div>
                                        </div>
                                    </div>
                                </a>

                                <div id="a1" className="collapse out well">This is the message body1</div>
                                <br/>
                                <button className="btn btn-primary btn-xs"><i
                                    className="fa fa-check-square-o"></i> Delete Checked Item's
                                </button>
                            </div>


                            <div className="tab-pane" id="sent">
                                <a type="button" data-toggle="collapse" data-target="#s1">
                                    <div className="btn-toolbar well well-sm" role="toolbar"
                                         style={{"margin": "0px"}}>
                                        <div className="btn-group"><input type="checkbox"/></div>

                                        <div className="btn-group col-md-3">Kumar</div>
                                        <div className="btn-group col-md-8"><b>This is reply from
                                            Bootstrap plugin</b>

                                            <div className="pull-right"><i
                                                className="glyphicon glyphicon-time"></i> 12:30 AM
                                            </div>
                                        </div>
                                    </div>
                                </a>

                                <div id="s1" className="collapse out well">This is the message body1
                                </div>
                                <br/>
                                <button className="btn btn-primary btn-xs"><i
                                    className="fa fa-check-square-o"></i> Delete Checked Item's
                                </button>
                            </div>


                            <div className="tab-pane" id="assignment">
                                <a href="">
                                    <div className="well well-sm" style={{"margin": "0px"}}>Open GL
                                        Assignments <span className="pull-right"><i
                                            className="glyphicon glyphicon-time"></i> 12:20 AM 20 Dec 2014 </span>
                                    </div>
                                </a>
                            </div>

                            <div className="tab-pane" id="event">
                                <div className="media">
                                    <a className="pull-left" href="#">
                                        <img className="media-object img-thumbnail" width="100"
                                             src="http://placehold.it/120x120" alt="..."/>
                                    </a>

                                    <div className="media-body">
                                        <h4 className="media-heading">Animation Workshop</h4>
                                        2Days animation workshop to be conducted
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <ul className="nav nav-pills nav-stacked well">
                            <li className="active"><a><i className="fa fa-envelope"></i>Online</a></li>
                            {this.props.admins && this.props.admins.length && _.map(this.props.admins, (admin, index) => {
                                return (<li className="list-group-item" key={index}>{admin.name}</li>)
                            })}
                        </ul>
                    </div>
                </div>

                <div className="chat-room-container">
                    {rooms}
                </div>
            </div>
        );
    }
}

export default Admin

