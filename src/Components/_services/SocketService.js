import io from 'socket.io-client';

const socket = io('http://localhost:8551');

export default socket;
