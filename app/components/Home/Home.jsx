import React from "react";
import PropTypes from "prop-types";
import ChatBot from '../shared/ChatBot';

class Home extends React.Component {


    constructor(props) {
        super(props);
        //this.room = {};
        this.logo = 'https://medias2.prestastore.com/835054-pbig/chat-bot-for-social-networking.jpg',
            this.state = {
                messages: [{
                    "type": 'response',
                    "text": "Hello! What is your name?",
                    "template": false
                }],
                room: {},
                connected: false,
                flag: false,
                user: "client" //to distinguish between admin and user
            };
        this.user = {
            name: '',
            text:''
        };
    }

  /*  getCredentials = (value, type) => {
        switch (type) {
            case 'name':
                this.user.name = value;
                this.setState({name: value});
                break;
            default:
                break;
        }
    }*/

    addUser = (user) => {
        let details = Object.assign({}, user, this.user);
        this.props.addNewUser(details);
    }
    handleMessageEvent = () => {
        const {socket} = this.props;
        socket.on('admin-msg', (message) => {
            if (this.props.history.location.pathname != "/admin") {
                let msg = JSON.parse(message);
                //this.props.createMessage({room: this.props.room, newMessage: {user: JSON.parse(inboundMessage).user, message: JSON.parse(inboundMessage).message}})
                console.log('received message from adminnnnnnnnnnnn', JSON.parse(message));
                let obj = {
                    type: msg.type,
                    text: msg.text,
                    template: false
                }
                let chats = this.state.messages;
                chats.push(obj);
                this.setState({messages: chats});

            }
        });
    }

    handleUserMessage = (msg) => {
        console.log(`New message incomig! ${msg}`);
        const {room, socket} = this.props
        if (msg && msg.field && msg.field == "name") {
            var obj = {
                type: "client",
                text: msg.text,
                template: false,
                room: room._id
            }
            this.user.name = msg.text;
            let chats = this.state.messages;
            chats.push(obj);
            this.setState({messages: chats}, () => { //better would be to make a add message response/client function
                if (this.state.messages.length == 2) {
                    var obj = {
                        type: "response",
                        text: "",
                        template: true
                    }
                    let chats = this.state.messages;
                    chats.push(obj);
                    this.setState({messages: chats});
                }

            });
            //updateScroll();
            if (!_.isEmpty(this.user.name) && !_.isEmpty(this.props.room)) {
                socket.emit('user-msg', JSON.stringify({room: room, message: obj}));
            }
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
            //onseMessage(`How may i help you?`);
            nextProps.socket.emit('joinRoom', {room: nextProps.room});
        }
    }

    componentDidMount() {
        this.handleMessageEvent();
        const {socket} = this.props;
        const self = this;
        socket.on("room-details", (data) => {
            self.setState({room: data});
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
        return (
            <section className="container bg-gray">
                <ChatBot messages={this.state.messages} handleUserMessage={this.handleUserMessage}
                    user={this.state.user} addUser={this.addUser} room={this.state.room} from="client"/>
            </section>
        )
    }
}

Home.propTypes = {
    history: PropTypes.object.isRequired
};

export default Home;

