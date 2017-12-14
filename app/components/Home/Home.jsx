import React from "react";
import PropTypes from "prop-types";
import ChatBot from '../shared/ChatBot';
import {renderBooksList, emailValidator} from "../../utility";
import DynamicStep from "../shared/DynamicStep";
import {Widget, addResponseMessage, addLinkSnippet, renderCustomComponent} from 'react-chat-widget';
import InputForm from "../shared/InputForm";
import 'react-chat-elements/dist/main.css';
import {ChatItem, MessageBox, ChatList, Input, Button, Navbar} from 'react-chat-elements'


class Home extends React.Component {
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

    constructor(props) {
        super(props);
        this.room = {};
        this.logo = 'https://medias2.prestastore.com/835054-pbig/chat-bot-for-social-networking.jpg',
            this.state = {
                steps: [],
                name: "",
                message: "",
                messages: [{
                    message: 'How do I use this messaging app?',
                    from: 'right',
                    backColor: '#3d83fa',
                    textColor: "white",
                    avatar: 'https://www.seeklogo.net/wp-content/uploads/2015/09/google-plus-new-icon-logo.png',
                    duration: 2000,
                }, {
                    message: 'How do I use this messaging app?',
                    from: 'left',
                    backColor: '#3d83fa',
                    textColor: "white",
                    avatar: 'https://www.seeklogo.net/wp-content/uploads/2015/09/google-plus-new-icon-logo.png',
                    duration: 2000,
                }, {
                    message: 'How do I use this messaging app?',
                    from: 'right',
                    backColor: '#3d83fa',
                    textColor: "white",
                    avatar: 'https://www.seeklogo.net/wp-content/uploads/2015/09/google-plus-new-icon-logo.png',
                    duration: 2000,
                }]
            };
        this.user = {
            name: ''
        };
        this.state = {
            room: {},
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
                {/*<div className="wraper">
             <ChatBot message={this.state.message} createUser={this.createUser} {...this.props} step={this.state.newStep}/>
             </div>*/}
                <div className="App">
                    <Widget id="1234" key="1234"
                            handleNewUserMessage={this.handleNewUserMessage} profileAvatar={this.logo}
                            title={room}
                            subtitle={this.user.name}
                    />
                    <div className="widget-container">
                        <div className="conversation-container">

                            <Navbar
                                center={
                                    <div>welcome </div>
                                }/>
                            <div className="messages-container">
                                <ChatItem className="client"
                                    avatar={'https://medias2.prestastore.com/835054-pbig/chat-bot-for-social-networking.jpg'}
                                    alt={'Reactjs'}
                                    title={'Facebook'}
                                    subtitle={'What are you doing?'}
                                    date={new Date()}
                                    unread={0}/>
                                <ChatItem className="response"
                                avatar={'https://medias2.prestastore.com/835054-pbig/chat-bot-for-social-networking.jpg'}
                                alt={'Reactjs'}
                                title={'Facebook'}
                                subtitle={'What are you doing?'}
                                date={new Date()}
                                unread={0}/>
                                <ChatItem className="client"
                                avatar={'https://medias2.prestastore.com/835054-pbig/chat-bot-for-social-networking.jpg'}
                                alt={'Reactjs'}
                                title={'Facebook'}
                                subtitle={'What are you doing?'}
                                date={new Date()}
                                unread={0}/>
                                <ChatItem className="response"
                                avatar={'https://medias2.prestastore.com/835054-pbig/chat-bot-for-social-networking.jpg'}
                                alt={'Reactjs'}
                                title={'Facebook'}
                                subtitle={'What are you doing?'}
                                date={new Date()}
                                unread={0}/>
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
            </section>
        )
    }
}

Home.propTypes = {
    history: PropTypes.object.isRequired
};

export default Home;

