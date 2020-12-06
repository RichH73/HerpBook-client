import io from 'socket.io-client';

const socket = io('http://192.168.0.2:8551');

export default socket;
