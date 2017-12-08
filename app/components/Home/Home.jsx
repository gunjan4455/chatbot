import React from "react";
import PropTypes from "prop-types";
import ChatBot from '../shared/ChatBot';
import {renderBooksList, emailValidator} from "../../utility";
import InputForm from "../shared/InputForm";
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            steps: [],
            flag: false
        };
        this.user = {
            name: ''
        };
    }

    componentWillMount() {
        let steps = [{
            id: '1',
            message: 'What is your name?',
            trigger: '2',
        }, {
            id: '2',
            user: true,
            validator: (value) => {
                if (!value) {
                    return 'We will need your credentials';
                }
                this.getCredentials(value, 'name');
                return true;
            },
            trigger: '3',
        }, {
            id: '3',
            message: 'Hi {previousValue},what would you like to enter?',
            trigger: '4'

        },
            {
                id: '4',
                options: [
                    {value: 'id', label: 'Id/Password', trigger: '5'},
                    {value: 'email', label: 'Email', trigger: '6'},
                ]
                //validator: (value) => {
                //  //if (!emailValidator(value)) {
                //  //  return 'Please enter valid email';
                //  //}
                //  this.getCredentials(value, 'email');
                //  return true;
                //},
            }, {
                id: '5',
                component: <InputForm option={true} addUser={this.addUser} {...this.props}/>,
                waitAction: true,
                trigger: '7'
            }, {
                id: '6',
                component: <InputForm addUser={this.addUser} option={false}/>,
                waitAction: true,
                trigger: '7'
            }, {
                id: '7',
                message: "Great!!done",
                end: true
            }];
        this.setState({steps : steps});
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

    addUser = (user) => {
        let details = Object.assign({}, user, this.user);
        this.props.addNewUser(details); //this dispatchs from wrapper
    }

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
        });
    }

    componentDidMount() {
        this.handleMessageEvent();
    }

    render() {
        return (
            <section className="container bg-gray">
                <div className="wraper">
                    <ChatBot steps={this.state.steps}/>
                </div>
            </section>
        )
    }
}

Home.propTypes = {
    history: PropTypes.object.isRequired,
};

export default Home;


