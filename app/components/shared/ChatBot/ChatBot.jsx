import React from "react";
import Chatbot from 'react-simple-chatbot';
import InputForm from "../InputForm";
import DynamicStep from "../DynamicStep";
import DynamicStep1 from "../InputFormWrapper";

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
            message: ""
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
            trigger: '3'
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
                component: <InputForm option={true} addUser={this.addUser} {...this.props}
                                      newMessage={this.newMessage}/>,
                waitAction: true,
                asMessage: true,
                trigger: '7'
            }, {
                id: '6',
                component: <InputForm addUser={this.addUser} option={false}/>,
                waitAction: true,
                asMessage: true
            }, {
                id: '7',
                component: <DynamicStep message={this.state.message}/>,
                asMessage: true,
                end: true
            }];
        if (!_.isEmpty(this.props.step))
            steps.push(this.props.step);
        this.setState({steps: steps});
    }

    render() {
        console.log("rooooooooooo", this.props);
        let room = this.props.room ? this.props.room.title : "";
        return (

            <div className="wrapper ">
                <div className="rsc-container sc-iwsKbI kdZMGe" width="350px">
                    <div className="rsc-header sc-gqjmRU glfuN"><h2 className="rsc-header-title sc-VigVT dYUxQs">Chat</h2></div>
                    <div className="rsc-content sc-gZMcBi bxslzG">
                        <div className="rsc-ts sc-dnqmqq efROPc">
                            <div className="rsc-ts-image-container sc-htoDjs vmYlS"><img
                                className="rsc-ts-image sc-gzVnrw hLGSaN" alt="avatar"/></div>
                            <div className="rsc-ts-bubble sc-bZQynM fhAWVE">What is your name?</div>
                        </div>
                    </div>
                    <div className="rsc-footer sc-jzJRlG byHcWR"><input type="textarea" className="rsc-input sc-cSHVUG ivHxXV"
                                                                    placeholder="Type the message ..." value=""/>
                        <button className="rsc-submit-button sc-kAzzGY dBBLzP"></button>
                    </div>
                </div>
            </div>

    //<Chatbot
        //    headerTitle={room}
         //   steps={this.state.steps}
          //  {...this.props}/>
    );
    }
    }

    export default ChatBot;

