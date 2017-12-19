import React from "react";
import _ from "lodash";
import InputForm from "../InputForm";
import ChatItem from "../ChatItem";
import {Navbar, Button} from "react-chat-elements";

class ChatBot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            messages: this.props.room && this.props.room.messages
        };
        this.user = {
            name: ""
        };
    }

  /*  getCredentials = (value, type) => {
        switch (type) {
            case "name":
                this.user.name = value;
                break;
            default:
                break;
        }
    }
*/
    addUser = user => {
        let details = Object.assign({}, user, this.user);
        this.props.addUser(details); //this dispatchs from wrapper
    }

    messages = () => {
        let texts = _.map(this.state.messages, (message, index) => {
            return (
                <ChatItem
                    className={message.type}
                    avatar={
                        "https://medias2.prestastore.com/835054-pbig/chat-bot-for-social-networking.jpg"
                    }
                    alt={"Reactjs"}
                    subtitle={message.text}
                    date={new Date()}
                    unread={0}
                    key={index}
                    template={message.template}
                    addUser={this.addUser}
                    userName={this.user.name}
                />
            );
        });
        return texts;
    }

    updateInputValue = evt => {
        this.setState({message: evt.target.value});
    }

    handleUserMessage = evt => {
        evt.preventDefault();
        let message = this.state.message;
        const {socket, room} = this.props;
        let obj = {
            type: "response",
            text: message,
            room: room._id
        };
        socket.emit("admin-msg", JSON.stringify({room: room, message: obj}));
        let msgs = this.state.messages;
        msgs.push(obj);
        this.setState({message: "", messages: msgs});
    }

    handleNewUserMessage = () => {
        // Now send the message throught the backend API
        // addResponseMessage(`Hi ${newMessage},what would you like to enter?`);
        const {socket, room} = this.props;
        const self = this;
        socket.on('user-msg'+room.title, (message) => {
            console.log('received message from user', message);
            let msg = JSON.parse(message);
            let obj = {
                type: "client",
                text: msg.text,
                room: room._id
            };
            let msgs = self.state.messages;
            msgs.push(obj);
            self.setState({message: "", messages: msgs});
            updateScroll();
            //  addResponseMessage("from 22222");
        });
    }

    componentDidMount() {
        this.handleNewUserMessage();
    }

    render() {
        let messages = this.messages();
        return (
            <div className="App">
                <div className="widget-container">
                    <div className="conversation-container">
                        <Navbar center={<div>{this.user.name||"welcome"} </div>}/>
                        <div className="messages-container">{messages}</div>
                        <form onSubmit={this.handleUserMessage}>
                            <input
                                className="sender"
                                placeholder="Type here..."
                                multiline="true"
                                value={this.state.message}
                                onChange={this.updateInputValue}
                            />
                            <button
                                className="send"
                                color="white"
                                text="Send"
                                type="submit"
                                value="send"
                                onSubmit={this.handleUserMessage}
                            >
                                send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatBot;
