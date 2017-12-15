import React from "react";
import Chatbot from 'react-simple-chatbot';
import _ from 'lodash';
import InputForm from "../InputForm";
import DynamicStep from "../DynamicStep";
import DynamicStep1 from "../InputFormWrapper";
import {ChatItem, MessageBox, ChatList, Input, Button, Navbar} from 'react-chat-elements'

class ChatBot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [],
            name: "",
            message: ""
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
                break;
            default:
                break;
        }
    }

    addUser = (user) => {
        let details = Object.assign({}, user, this.user);
        this.props.createUser(details); //this dispatchs from wrapper
    }

    handleNewUserMessage = (newMessage) => {
        console.log(`New widgt message incoming! ${newMessage}`);
        // Now send the message throught the backend API
        // addResponseMessage(`Hi ${newMessage},what would you like to enter?`);
        const {socket, room} = this.props;
        socket.emit('admin-msg', {room: room, message: newMessage});


        socket.on('user-msg', (inboundMessage) => {
            console.log('received message from user', inboundMessage);
            //addResponseMessage(inboundMessage);
        });
    }

    messages = () => {
        let texts =  _.map(this.props.messages, (message) => {
                return (
                    <ChatItem className={message.type}
                          avatar={'https://facebook.github.io/react/img/logo.svg'}
                          alt={'Reactjs'}
                          subtitle={message.text}
                          date={new Date()}
                          unread={0}
                        ket={message.text}/>
                )
            })
        return texts;
    }

    render() {
        let messages = this.messages();
        return (
            <div className="App">
                <div className="widget-container">
                    <div className="conversation-container">
                        <Navbar
                            center={
                                    <div>welcome </div>
                                }/>
                        <div className="messages-container">
                            {messages}
                        </div>
                        <Input
                            placeholder="Type here..."
                            multiline={true}
                            rightButtons={
                                    <Button
                                        color='white'
                                        backgroundColor='black'
                                        text='Send'
                                        onClick={this.handleNewUserMessage}/>
                                }/>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatBot;

