import React from "react";

export class InputForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.details = {
            userid: '',
            password: '',
            email: ''
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
            nextProps.triggerNextStep();
            //nextProps.createConnection();
        }
    }

    render() {
        return (
            <div className="container">
                {this.state.showForm ?
                    <div>
                        { this.props.option ? (
                            <form className="form-horizontal" onSubmit={this.onSubmit}>
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

