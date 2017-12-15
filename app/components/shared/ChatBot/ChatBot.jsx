import React from "react";
import Chatbot from 'react-simple-chatbot';
import _ from 'lodash';
import InputForm from "../InputForm";
import ChatItem from "../ChatItem/ChatItem";
import {Navbar, Button} from 'react-chat-elements'

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

    messages = () => {
        let texts =  _.map(this.props.messages, (message) => {
                return (
                    <ChatItem className={message.type}
                          avatar={'https://medias2.prestastore.com/835054-pbig/chat-bot-for-social-networking.jpg'}
                          alt={'Reactjs'}
                          subtitle={message.text}
                          date={new Date()}
                          unread={0}
                          key={message.text}
                          template={message.template}/>
                )
            })
        return texts;
    }

    updateInputValue = (evt) => {
        console.log("jjjjjj",evt.target.value);
        this.setState({message : evt.target.value});
    }

    handleUserMessage = (evt) => {
        evt.preventDefault();
        let obj = {
            type : this.props.user,
            text : this.state.message,
            field : "name"
        }
        this.props.handleUserMessage(obj);
        this.setState({message : ""});
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
                        <form onSubmit={this.handleUserMessage}>
                            <input
                                placeholder="Type here..."
                                multiline={true}
                                value={this.state.message}
                                onChange={this.updateInputValue}/>
                            <button
                                color='white'
                                backgroundColor='black'
                                text='Send'
                                type="submit"
                                onSubmit={this.handleUserMessage}/>

                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatBot;
