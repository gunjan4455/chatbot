import React from "react";
import config from '../../config'
const { API: { protocols, domain , imagePath} } = config;

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            handleDropdown : "dropdown"
        }
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    handlePanel = () => {
        if(this.state.handleDropdown == "open")
            this.setState({handleDropdown : "close"});
        else
            this.setState({handleDropdown : "open"});

    }

    logout = () => {
        this.props.logout(this.props.user);
    }

    render() {
        return (
            <nav className="navbar navbar-inverse container" role="navigation">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand">Saxo Bank</a>
                    </div>

                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

                        <ul className="nav navbar-nav navbar-right">
                            <li className={`dropdown ${this.state.handleDropdown}`}>
                                <a className="dropdown-toggle" data-toggle="dropdown" onClick={this.handlePanel}>{this.props.user.name||"user"}<b className="caret"></b></a>
                                <ul className="dropdown-menu">
                                    <li align="center" className="well">
                                        <div><img className="img-responsive" style={{"padding":"2%"}} src="http://placehold.it/120x120"/><a className="change" href="">Change Picture</a></div>
                                        <a className="btn btn-sm btn-default"><span className="glyphicon glyphicon-lock"></span> Security</a>
                                        <a className="btn btn-sm btn-default" onClick={this.logout}><span className="glyphicon glyphicon-log-out"></span> Logout</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header
