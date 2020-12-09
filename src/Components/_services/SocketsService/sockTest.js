import React from 'react';
import { useSelector } from 'react-redux';

const MyStoreTest = () => {
	const counter = useSelector((state) => state.counter);
	console.log('this is the counter line', counter);
	return (
		<div>
			<p>Stuff</p>
		</div>
	);
};

export default MyStoreTest;
