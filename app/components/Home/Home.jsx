import React from "react";
import PropTypes from "prop-types";
import ChatBot from '../shared/ChatBot';
import InputForm from "../shared/InputForm";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.room = {};
        this.logo = 'https://medias2.prestastore.com/835054-pbig/chat-bot-for-social-networking.jpg',
        this.state = {
            messages :
                [{
                    "type": 'response',
                    "text": "Hello! What is your name?",
                    "template" : false
                }],
            room: {},
            connected: false,
            flag: false,
            user: "client" //to distinguish between admin and user
        };
        this.user = {
            name: ''
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
            //onseMessage(`How may i help you?`);
            nextProps.socket.emit('joinRoom', {room: nextProps.room});
        }
    }

    componentDidMount() {
        this.handleMessageEvent();
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
        });
        socket.on('admin-msg', (inboundMessage) => {
            //this.props.createMessage({room: this.props.room, newMessage: {user: JSON.parse(inboundMessage).user, message: JSON.parse(inboundMessage).message}})
            console.log('received message from adminnnnnnnnnnnn', inboundMessage);
            //addResponseMessage(inboundMessage);
        });

    }

    handleUserMessage = (msg) => {
        console.log(`New message incomig! ${msg}`);
        if(msg && msg.field && msg.field=="name") {
            let obj = {
                type : "client",
                text : msg.text,
                template : false
            }
            this.user.name = msg.text;
            let chats = this.state.messages;
            chats.push(obj);
            this.setState({messages : chats},() => {
                if(this.state.messages.length == 2) {
                    let obj = {
                        type : "response",
                        text : "",
                        template : true
                    }
                    let chats = this.state.messages;
                    chats.push(obj);
                    this.setState({messages : chats});
                }
            });
        }

        //const {socket} = this.props;
        //
        //// Now send the message throught the backend API
        ////addResponseMessage(newMessage);
        //if (!_.isEmpty(this.user.name) && !this.state.flag) {
        //    renderCustomComponent(InputForm, {
        //        ...this.props,
        //        addUser: this.addUser,
        //        option: true,
        //        username: this.user.name
        //    }, true)
        //}
        //if (!_.isEmpty(this.user.name) && !_.isEmpty(this.room)) {
        //    socket.emit('user-msg', {room: this.room, message: newMessage});
        //}
    }

    render() {
        return (
            <section className="container bg-gray">
                <ChatBot messages={this.state.messages} handleUserMessage={this.handleUserMessage} user={this.state.user} addUser={this.addUser}/>
            </section>
        )
    }
}

Home.propTypes = {
    history: PropTypes.object.isRequired
};

export default Home;

