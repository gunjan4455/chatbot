import React from "react";
import DynamicStep from "../DynamicStep";

export class InputForm extends React.Component {
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
        else
            this.setState({showForm : false});

    }

    render() {
        return (
            <div className="response">
                {this.state.showForm ?
                    <div  className="message-text">
                        { this.props.option ? (
                            <form className="form-horizontal" onSubmit={this.onSubmit}>
                                <h5> hi,  {this.props.userName}
                                <br/><p>Please enter the credentials
                                </p></h5>
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
                    : <div className="response">
                        <div className="message-text">
                            <p>Successfully registered</p>
                    </div>
                </div> }
            </div>
        );
    }
}

export default InputForm;

