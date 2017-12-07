import React from "react";
import _ from 'lodash';
import DetailModal from "../shared/DetailModal";
import ConfirmationModal from "../shared/ConfirmationModal";
import BackButton from '../shared/BackButton';
import ChatBot from '../shared/ChatBot';
import InputForm from "../shared/InputForm";

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            greetingMessage:"",
            chatRooms : [],
            steps : [],
            room : {}
        };
        this.chatRequests = [];

        this.handleSubmit=this.handleSubmit.bind(this);
        this.onHideModal=this.onHideModal.bind(this);
    }

    sendMessage = (value) => {
        const {socket} = this.props;
        socket.emit('chat-message', {room : this.state.room, message : value});
    }

    componentWillMount() {
        let steps = [{
            id: '1',
            message: "How may I help?",
            trigger: ({value, steps}) => {
                this.sendMessage(steps[1].message);
                return '2';
            }

        }, {
            id: '2',
            user: true,
            validator: (value) => {
                if (!value) {
                    return 'We will need your credentials';
                }
                this.getCredentials(value, 'name');
                return true;
            },
            trigger: '3'
        }, {
            id: '3',
            message: 'Hi {previousValue},what would you like to enter?',
            trigger: '4'

        },
            {
                id: '4',
                options: [
                    {value: 'id', label: 'Id/Password', trigger: '5'},
                    {value: 'email', label: 'Email', trigger: '6'},
                ]
                //validator: (value) => {
                //  //if (!emailValidator(value)) {
                //  //  return 'Please enter valid email';
                //  //}
                //  this.getCredentials(value, 'email');
                //  return true;
                //},
            }, {
                id: '5',
                component: <InputForm option={true} addUser={this.addUser} {...this.props}/>,
                waitAction: true,
                trigger: '7'
            }, {
                id: '6',
                component: <InputForm addUser={this.addUser} option={false}/>,
                waitAction: true,
                trigger: '7'
            }, {
                id: '7',
                message: "Great!!done",
                end: true
            }];
        this.setState({steps : steps});
        this.props.getOnlineUsers();
        this.props.getAdmins();

    }

    componentDidMount() {

        const {socket} = this.props;
        const self=this;
        socket.on('greeting-request', function (room) {
            self.chatRequests.unshift(room);
            console.log("msssg", room);
            self.setState({
                greetingMessage:room.message,
                room : room
            });
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const {socket} = this.props;
        const {room} = this.state;
        this.setState({greetingMessage : ''});
        console.log("rrrrrrrrrrr", this.state.room);
        socket.emit('accept-greeting-request', {room : room});
        let chats = this.state.chatRooms;
        chats.push(this.chatRequests.pop());
        this.setState({chatRooms : chats});
    }

    onHideModal(e) {
        e.preventDefault();
        this.setState({greetingMessage : ''})
    }

    chats = () => {
        let rooms = _.map(this.state.chatRooms, (room, index) => {
            return (
                <ChatBot key={index} steps={this.state.steps} room={room}/>
            )
        });
        return rooms;
    }

    render() {
        let rooms = this.chats();
        console.log("chats==========", this.chats());
        return (
            <div className="container">
                {this.state.greetingMessage && <DetailModal  handleSubmit={this.handleSubmit}  onHideModal={this.onHideModal}  greetingMessage={this.state.greetingMessage}></DetailModal>}
                <div className="row well">
                    <div className="col-md-2">
                        <ul className="nav nav-pills nav-stacked well">
                            <li className="active"><a><i className="fa fa-envelope"></i>Online</a></li>
                            {this.props.onlineUsers && this.props.onlineUsers.length && _.map(this.props.onlineUsers, (onlineUsers, index) => {
                                return (<li className="list-group-item" key={index}>{onlineUsers.name}</li>)
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

