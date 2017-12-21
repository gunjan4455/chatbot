import React from "react";
import _ from 'lodash';
import InputForm from "../InputForm";
import ChatItem from "../ChatItem";
import {Navbar, Button} from '../Navbar/Navbar'
import {updateScroll} from "../../../utility/index.js"
import {Collapse } from 'react-bootstrap';
class ChatBot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ""

        };
    }

    addUser = (user) => {
        this.props.addUser(user); //this dispatchs from wrapper
    }

    messages = () => {
        let texts = _.map(this.props.messages, (message, index) => {
            return (
                <ChatItem className={message.type}
                          avatar={'https://medias2.prestastore.com/835054-pbig/chat-bot-for-social-networking.jpg'}
                          alt={'Reactjs'}
                          subtitle={message.text}
                          date={new Date()}
                          unread={0}
                          key={index}
                          template={message.template}
                          addUser={this.addUser}
                          userName={this.props.userName}
                          user={this.props.user}/>

            )
        })
        return texts;
    }
    updateInputValue = (evt) => {
        this.setState({message: evt.target.value});
    }
    handleUserMessage = (evt) => {
        evt.preventDefault();


        let obj = {
            type: this.props.user,
            text: this.state.message,
            field: "name",
            room: this.props.room
        }
        this.props.handleUserMessage(obj);
        this.setState({message: ""});
    }

    componentDidUpdate() {
        updateScroll()
    }

    render() {
        let messages = this.messages();
        return (
            <div className="App">
                <div className="widget-container">
                    <div className="conversation-container" >
                        <Navbar right={
                            <span className={this.state.open?"glyphicon glyphicon-plus":"glyphicon glyphicon-minus"} onClick={() => this.setState({open: !this.state.open})}>

                            </span>}
                                center={
                                    <div className="user-header">{this.props.userName || "Saxo Chat Support"} </div>
                                }
                        />
                        <Collapse  in={!this.state.open}>
                        <div className="messages-container" >
                            {messages}
                        </div>
                        </Collapse>
                        <Collapse  in={!this.state.open}>
                        <form onSubmit={this.handleUserMessage}>
                            <input className="sender"
                                   placeholder="Type here..."
                                   multiline="true"
                                   value={this.state.message}
                                   onChange={this.updateInputValue}/>
                            <button className="send"
                                    color='white'
                                    text='Send'
                                    type="submit"
                                    value="send"
                                    onSubmit={this.handleUserMessage}>send
                            </button>

                        </form>
                        </Collapse>

                    </div>
                </div>
            </div>
        );
    }
}

export default ChatBot;
