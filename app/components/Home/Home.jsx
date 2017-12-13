import React from "react";
import PropTypes from "prop-types";
import ChatBot from '../shared/ChatBot';
import {renderBooksList, emailValidator} from "../../utility";
import DynamicStep from "../shared/DynamicStep";
import {Widget, addResponseMessage, addLinkSnippet, renderCustomComponent} from 'react-chat-widget';
import InputFormWrapper from "../shared/InputFormWrapper";


class Home extends React.Component {
    newMessage = (msg) => {
        this.setState({message: msg});
    };
    getCredentials = (value, type) => {
        switch (type) {
            case 'name':
                this.user.name = value;
                break;
            default:
                break;
        }
    };
    addUser = (user) => {
        let details = Object.assign({}, user, this.user);
        this.createUser(details); //this dispatchs from wrapper
    };
    createUser = (user) => {
        this.props.addNewUser(user); //this dispatchs from wrapper
    };
    handleMessageEvent = () => {
        const {socket} = this.props;
        socket.on('chat-message', (inboundMessage) => {
            //this.props.createMessage({room: this.props.room, newMessage: {user: JSON.parse(inboundMessage).user, message: JSON.parse(inboundMessage).message}})
            console.log('received message from adminnnnnnnnnnnn', inboundMessage)
            /* let newStep = {
           id: '7',
           component: <DynamicStep message={this.state.message}/>,
           asMessage: true,
           end: true
       };

       this.setState({newStep: newStep});*/

        });
        socket.on('admin-msg', (inboundMessage) => {
            //this.props.createMessage({room: this.props.room, newMessage: {user: JSON.parse(inboundMessage).user, message: JSON.parse(inboundMessage).message}})
            console.log('received message from adminnnnnnnnnnnn', inboundMessage);
            addResponseMessage(inboundMessage);
            /* let newStep = {
           id: '7',
           component: <DynamicStep message={this.state.message}/>,
           asMessage: true,
           end: true
       };

       this.setState({newStep: newStep});*/

        });

    };
    handleNewUserMessage = (newMessage) => {
        console.log(`New message incomig! ${newMessage}`);
        this.getCredentials(newMessage, 'name');
        const {socket} = this.props;

        // Now send the message throught the backend API
        // addResponseMessage(`Hi ${newMessage},what would you like to enter?`);
        if (!_.isEmpty(this.user.name)) {
            renderCustomComponent(InputFormWrapper, {
                ...this.props,
                addUser: this.addUser,
                option: true,
                username: this.user.name
            }, true)
        }
        if (!_.isEmpty(this.user.name) &&!_.isEmpty(this.room) ){

            socket.emit('user-msg', {room: this.room, message: newMessage});
        }


    };

    constructor(props) {
        super(props);
        this.room={};
        this.logo = 'https://medias2.prestastore.com/835054-pbig/chat-bot-for-social-networking.jpg',
            this.state = {
                steps: [],
                name: "",
                message: ""
            };
        this.user = {
            name: ''
        };
        this.state = {
            room : {},
            connected: false,
            steps: [],
            flag: false,
            stepName: "last",
            message: "abcd",
            newStep: {}
        };

    }

    init(user, type) {
        const {socket} = this.props;
        socket.emit('subscribe', {user: user});
        let self = this;
        socket.on('subscribeSuccess', function (user) {
            let room = {};
            room.title = user.name;
            room.owner = user._id;
            if (!user.isAdmin)
                self.props.createChatRoom(room)
        });
    }

    componentWillReceiveProps(nextProps, prv) {
        if (!_.isEmpty(nextProps.user) && nextProps.user.isAdmin && _.isEmpty(nextProps.room)) {
            this.init(nextProps.user, "admin");
            nextProps.history.push('/admin');
        } else if (!_.isEmpty(nextProps.user) && _.isEmpty(nextProps.room))
            this.init(nextProps.user, "client");

        if (!_.isEmpty(nextProps.room) && !this.state.flag) {
            this.setState({flag: true});
            nextProps.socket.emit('joinRoom', {room: nextProps.room});
        }

    }

    componentDidMount() {
        this.handleMessageEvent();

        addResponseMessage("Welcome....What is your name?");
        const {socket} = this.props;

        const self=this;
        socket.on("room-details",(data)=>{
            this.room = data;
        });
        socket.on('greeting-request', function (room) {
        //    self.chatRequests.unshift(room);
         //   console.log("msssg", room);
            self.setState({
                room : room
            });
        });
    }

    render() {
        console.log("rooooooooooo", this.props);
        let room = this.props.room ? this.props.room.title : "";
        return (
            <section className="container bg-gray">
                {/*<div className="wraper">
                    <ChatBot message={this.state.message} createUser={this.createUser} {...this.props} step={this.state.newStep}/>
                </div>*/}
                <div className="App">
                    <Widget
                        handleNewUserMessage={this.handleNewUserMessage} {...this.props} profileAvatar={this.logo}
                        title={room}
                        subtitle={this.user.name}
                    />
                </div>
            </section>
        )
    }
}

Home.propTypes = {
    history: PropTypes.object.isRequired
};

export default Home;


