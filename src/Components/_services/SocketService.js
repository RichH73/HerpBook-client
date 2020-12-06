import io from 'socket.io-client';

const socket = io('http://localhost:8551');

const mapStateToProps = function (state) {
	return {
		API: state,
	};
};

export default socket;
