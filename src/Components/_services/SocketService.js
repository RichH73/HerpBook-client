import io from 'socket.io-client';
import serverStatus from '../../reducers/config';

const socket = io(serverStatus().server.serverSocket);

// console.log('this is the socket', socket)

// if (!!localStorage.tokenz) {
// 	socket.on('connect', () => {
// 		socket.emit('newUser', {
// 			authToken: localStorage.token,
// 		});
// 		// 	socket.emit('checkMessages', { uid: this.props.userUid, Authorization: `Bearer ${localStorage.token}` });
// 		// 	socket.on('newMessages', (messageData) => {
// 		// 		console.log('new message data', messageData);
// 		// 		this.props.newMessages({
// 		// 					messageCount: messageData.filter((count) => !count.seen).length, //get(response, "data", 0).length,
// 		// 					messages: messageData,
// 		// 				});
// 		// 	});
// 	});
// }

export default socket;
