import React from "react";
import DynamicStep from "../DynamicStep";

export class InputForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.details = {
            userid: '',
            password: '',
            email: '',
            name: this.props.name ? this.props.name : ""
        };
        this.state = {
            showForm : true
        }
    }

    onChange = (type, evt) => {
        switch (type) {
            case 'userid':
                this.details.userid = Number(evt.target.value);
                break;
            case 'password':
                this.details.password = evt.target.value;
                break;
            case 'email':
                this.details.email = evt.target.value;
                break;
            default:
                break;
        }

    }

    onSubmit = (evt) => {
        evt.preventDefault();
        this.props.addUser(this.details);
    }

    componentWillReceiveProps(nextProps, prv) {
        if(!_.isEmpty(nextProps.user) && !_.isEmpty(nextProps.user.isAdmin))
            nextProps.history.push('/admin');
        else {
            this.setState({showForm : false});
            //nextProps.triggerNextStep();
            //nextProps.createConnection();
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
                component: <DynamicStep  message={inboundMessage}/>,
                asMessage: true,
                end: true
            };

            this.props.newMessage(inboundMessage);
            this.props.triggerNextStep();

        });
    }

    componentDidMount() {
        this.handleMessageEvent();
    }

    render() {
        return (
            <div className="container">
                {this.state.showForm ?
                    <div>
                        { this.props.option ? (
                            <form className="form-horizontal" onSubmit={this.onSubmit}>
                                <h3> hi, {this.props.username}
                                <br/><p>Please enter the credentials
                                </p></h3>
                                <div style={{"marginBottom": "25px"}} className="input-group">
                                    <span className="input-group-addon"><i
                                        className="glyphicon glyphicon-user"></i></span>
                                    <input className="form-control" defaultValue="" placeholder="userid"
                                           onChange={this.onChange.bind(this,'userid')}/>
                                </div>
                                <div style={{"marginBottom": "25px"}} className="input-group">
                                    <span className="input-group-addon"><i
                                        className="glyphicon glyphicon-lock"></i></span>
                                    <input type="password" className="form-control" defaultValue=''
                                           placeholder="password"
                                           onChange={this.onChange.bind(this,'password')}/>
                                </div>
                                <div style={{"marginTop":"10px"}} className="form-group">
                                    <div className="col-sm-12 controls">
                                        <button type="submit" className="btn btn-success">Submit</button>
                                    </div>
                                </div>
                            </form> ) : (
                            <form className="form-horizontal" onSubmit={this.onSubmit}>
                                <div style={{"marginBottom": "25px"}} className="input-group">
                                    <span className="input-group-addon"><i
                                        className="glyphicon glyphicon-user"></i></span>
                                    <input className="form-control" defaultValue="" placeholder="email"
                                           onChange={this.onChange.bind(this,'email')}/>
                                </div>
                                <div style={{"marginTop":"10px"}} className="form-group">
                                    <div className="col-sm-12 controls">
                                        <button type="submit" className="btn btn-success">Submit</button>
                                    </div>
                                </div>
                            </form>)
                        }
                    </div>
                    : <div>Successfully registered</div> }
            </div>
        );
    }
}

export default InputForm;

