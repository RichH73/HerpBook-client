import io from 'socket.io-client';
import serverStatus from '../../reducers/config';
import React from 'react';
import { useSelector } from 'react-redux';

export const SocketService = () => {
	console.log('Starting socket service.');
	const userInfo = useSelector((state) => state.user);
	// setInterval(() => {
	// 	console.log('this user', userInfo.username);
	// }, 5000);
	return <div />;
};

const socket = io(serverStatus().server.serverSocket);

export default socket;
