import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class DynamicStep1 extends Component {
    constructor(props) {
        super(props);
        this.i=0;
        this.cnt=0;
        this.state = {
            name: 1,
            c: [1]
        };
    }
    chats = () => {
        let rooms = _.map(this.state.c, (room, index) => {
            this.cnt+=1;
            this.state.c.push([this.i]);
            if( this.cnt%2==0)
            {
                this.state.c.length= this.state.c.length-1;
            }
            return (
                <div key={index}>{this.state.name}
                </div>

            )
        });
        return rooms;
    };



    componentWillMount() {
        const {steps} = this.props;
        /* const {name} = steps;*/
       /* setInterval(() => {
            this.setState({
                name: Math.random(),

            })
        }, 2000)*/

    }

    render() {
        return (
            <div style={{width: '100%'}}>
                {this.props.message}
                <div>
                    </div>
            </div>
        );
    }
}

export default DynamicStep1;
