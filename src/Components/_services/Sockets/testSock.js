import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const TestSock = () => {
	const [response, setResponse] = useState('');

	useEffect(() => {
		const socket = io('http://localhost:8551');
		console.log(socket.connect());
		socket.emit('joinRoom', 123);
		socket.on('connect', (sock) => {
			console.log('connected', sock);
			socket.emit('joinRoom', 123);
		});
		console.log(socket.open());

		return () => socket.disconnect();
	}, []);
	return (
		<p>
			It's <time dateTime={response}>{response}</time>
		</p>
	);
};

export default TestSock;
