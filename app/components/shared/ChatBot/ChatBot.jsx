import React from "react";
import Chatbot from 'react-simple-chatbot';

class ChatBot extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("rooooooooooo",this.props);
        let room = this.props.room ? this.props.room.title : "";
        return (
            <Chatbot
                headerTitle={room}
                steps={this.props.steps}
            />);
    }
}

export default ChatBot;

