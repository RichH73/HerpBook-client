import io from 'socket.io-client';
import serverStatus from '../../reducers/config';
import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userInfoUpdate } from '../../actions/index';

export const SocketService = () => {
	const contextValue = useContext();
	console.log('Starting socket service.');
	const userInfo = useSelector((state) => state.user);
	const dispatch = useDispatch();

	socket.on('socketSet', (socket) => {
		console.log('Socket Service heard a socketSet');
		dispatch(userInfoUpdate('userSocket', true));
	});

	// setInterval(() => {
	// 	console.log('this user', userInfo.username);
	// }, 5000);
	return '<div />';
};

const socket = io(serverStatus().server.serverSocket);

export default socket;
