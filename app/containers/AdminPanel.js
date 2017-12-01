import { connect } from 'react-redux';
import Admin from '../components/Admin';
import { getSocket, getAdmins } from '../actions';

const mapStateToProps = (state, props) => {
    return {
        socket: state.socket,
        admins: state.admins
    }
};

const mapDispatchToProps = dispatch => ({
    getSocket: (socket) => dispatch(getSocket(socket)),
    getAdmins: () => dispatch(getAdmins())
});

const AdminPanel = connect(mapStateToProps, mapDispatchToProps)(Admin);
export default AdminPanel;

