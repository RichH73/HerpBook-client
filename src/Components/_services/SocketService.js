import io from 'socket.io-client';
import serverStatus from '../../reducers/config';

const socket = io(serverStatus().server.serverSocket);

// console.log('this is the socket', socket)

export default socket;
