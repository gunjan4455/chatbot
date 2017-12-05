import React from "react";
import Chatbot from 'react-simple-chatbot';

class ChatBot extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Chatbot
                steps={this.props.steps}
            />);
    }
}

export default ChatBot;

