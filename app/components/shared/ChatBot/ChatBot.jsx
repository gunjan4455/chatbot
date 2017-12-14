import React from "react";
import Chatbot from 'react-simple-chatbot';
import InputForm from "../InputForm";
import DynamicStep from "../DynamicStep";
import DynamicStep1 from "../InputFormWrapper";

import {Widget  as Bot, addResponseMessage} from 'react-chat-widget';

class ChatBot extends React.Component {
    newMessage = (msg) => {
        this.setState({message: msg});
    }
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
        this.props.createUser(details); //this dispatchs from wrapper
    };

    constructor(props) {
        super(props);
        this.state = {
            steps: [],
            name: "",
            message: "",
            messages :
                [{
                    "type" : 0,
                    "image": "cat.jpg",
                    "text": "Hello! Good Morning!"
                }, {
                    "type": 1,
                    "image": "dog.jpg",
                    "text": "Hello! Good Afternoon!"
                }]
        };
        this.user = {
            name: ''
        };
    }

    componentWillMount() {

    }

    handleNewUserMessage = (newMessage) => {
        console.log(`New widgt message incoming! ${newMessage}`);
        // Now send the message throught the backend API
        // addResponseMessage(`Hi ${newMessage},what would you like to enter?`);
        const {socket, room} = this.props;
        socket.emit('admin-msg',  {room : room,message:newMessage});


        socket.on('user-msg', (inboundMessage) => {
            console.log('received message from user', inboundMessage);
            //addResponseMessage(inboundMessage);
        });
    }

    render() {
        console.log("rooooooooooo", this.props);
        let room = this.props.room ? this.props.room.title : "";
        return (
            <div>
                <Bot key={this.props.room.title} id={this.props.room._id}
                    handleNewUserMessage={this.handleNewUserMessage}
                    title={this.props.room.title}
                    subtitle={this.props.room.title}
                />
            </div>
        );
    }
}

export default ChatBot;

