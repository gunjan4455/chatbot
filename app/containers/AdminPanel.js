import { connect } from 'react-redux';
import Admin from '../components/Admin';
import { getSocket } from '../actions';

const mapStateToProps = (state, props) => {
    return {
        socket: state.socket
    }
};

const mapDispatchToProps = dispatch => ({
    getSocket: (socket) => dispatch(getSocket(socket))
});

const AdminPanel = connect(mapStateToProps, mapDispatchToProps)(Admin);
export default AdminPanel;

