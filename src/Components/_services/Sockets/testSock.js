import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const TestSock = () => {
	const [response, setResponse] = useState('');

	useEffect(() => {
		const socket = io('http://localhost:8551');
		socket.on('FromAPI', (data) => {
			console.log('some data? ', data);
			setResponse(data);
		});
		console.log(
			socket.on('FromAPI', (data) => {
				setResponse(data);
			})
		);

		return () => socket.disconnect();
	}, []);
	return (
		<p>
			It's <time dateTime={response}>{response}</time>
		</p>
	);
};

export default TestSock;
