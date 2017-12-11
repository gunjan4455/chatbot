import React from "react";
import PropTypes from "prop-types";
import ChatBot from '../shared/ChatBot';
import {renderBooksList, emailValidator} from "../../utility";
import DynamicStep from "../shared/DynamicStep";


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            steps: [],
            flag: false,
            stepName: "last",
            message:"abcd",
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

    createUser = (user) => {
        this.props.addNewUser(user); //this dispatchs from wrapper
    };

    componentWillReceiveProps(nextProps, prv) {
        if (!_.isEmpty(nextProps.user) && nextProps.user.isAdmin && _.isEmpty(nextProps.room)) {
            this.init(nextProps.user, "admin");
            nextProps.history.push('/admin');
        } else if (!_.isEmpty(nextProps.user) && _.isEmpty(nextProps.room))
            this.init(nextProps.user, "client");

        if (!_.isEmpty(nextProps.room) && !this.state.flag) {
            this.setState({flag : true});
            nextProps.socket.emit('joinRoom', {room: nextProps.room});
        }

    }

    handleMessageEvent = () => {
        const {socket} = this.props;
        socket.on('chat-message', (inboundMessage) => {
            //this.props.createMessage({room: this.props.room, newMessage: {user: JSON.parse(inboundMessage).user, message: JSON.parse(inboundMessage).message}})
            console.log('received message from adminnnnnnnnnnnn', inboundMessage)
            //let self = this;
            //let id="8",trigger="9";
            //let chats = this.state.steps;
            //chats.push(newStep);
            //this.setState({steps : chats,
            //message:inboundMessage
            //});

            let newStep = {
                id: '7',
                component: <DynamicStep  message={this.state.message}/>,
                asMessage: true,
                end: true
            }

            this.setState({newStep : newStep});

        });
    }

    componentDidMount() {
        this.handleMessageEvent();
    }

    render() {
        return (
            <section className="container bg-gray">
                <div className="wraper">
                    <ChatBot message={this.state.message} createUser={this.createUser} {...this.props} step={this.state.newStep}/>
                </div>
            </section>
        )
    }
}

Home.propTypes = {
    history: PropTypes.object.isRequired
};

export default Home;


