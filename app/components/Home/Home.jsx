import React from "react";
import PropTypes from "prop-types";
import ChatBot from '../shared/ChatBot';
import {renderBooksList, emailValidator} from "../../utility";
import DynamicStep from "../shared/DynamicStep";
import {Widget, addResponseMessage, addLinkSnippet, renderCustomComponent} from 'react-chat-widget';
import InputForm from "../shared/InputForm";
import 'react-chat-elements/dist/main.css';


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.room = {};
        this.logo = 'https://medias2.prestastore.com/835054-pbig/chat-bot-for-social-networking.jpg',
            this.state = {
                steps: [],
                name: "",
                message: "",
                messages :
                    [{
                        "type": 'response',
                        "text": "Hello! What is your name?"
                    },{
                        "type" : 'client',
                        "text": "yes...."
                    }],
                room: {},
                connected: false,
                steps: [],
                flag: false,
                stepName: "last",
                newStep: {}
            };
        this.user = {
            name: ''
        };

    }

    newMessage = (msg) => {
        this.setState({message: msg});
    }
    getCredentials = (value, type) => {
        switch (type) {
            case 'name':
                this.user.name = value;
                this.setState({name: value});
                break;
            default:
                break;
        }
    }
    addUser = (user) => {
        let details = Object.assign({}, user, this.user);
        this.props.addNewUser(details);
    }
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

    }
    handleNewUserMessage = (newMessage) => {
        console.log(`New message incomig! ${newMessage}`);
        this.getCredentials(newMessage, 'name');
        const {socket} = this.props;

        // Now send the message throught the backend API
        //addResponseMessage(newMessage);
        if (!_.isEmpty(this.user.name) && !this.state.flag) {
            renderCustomComponent(InputForm, {
                ...this.props,
                addUser: this.addUser,
                option: true,
                username: this.user.name
            }, true)
        }
        if (!_.isEmpty(this.user.name) && !_.isEmpty(this.room)) {
            socket.emit('user-msg', {room: this.room, message: newMessage});
        }
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
            addResponseMessage(`How may i help you?`);
            nextProps.socket.emit('joinRoom', {room: nextProps.room});
        }

    }

    componentDidMount() {
        this.handleMessageEvent();

        addResponseMessage("Welcome....What is your name?");
        const {socket} = this.props;

        const self = this;
        socket.on("room-details", (data) => {
            this.room = data;
        });
        socket.on('greeting-request', function (room) {
            //    self.chatRequests.unshift(room);
            //   console.log("msssg", room);
            self.setState({
                room: room
            });
        });
    }

    render() {
        console.log("rooooooooooo", this.props);
        let room = this.props.room ? this.props.room.title : "";
        return (
            <section className="container bg-gray">
                <ChatBot messages={this.state.messages}/>
            </section>
        )
    }
}

Home.propTypes = {
    history: PropTypes.object.isRequired
};

export default Home;

