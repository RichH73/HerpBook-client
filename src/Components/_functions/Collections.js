import React from 'react';
import { useSelector } from 'react-redux';

const GetRecord = (data) => {
	const getClutch = useSelector((state) => state.myCollections.collections);
	const collection = getClutch.filter((collection) => {
		if (collection._id === data.recordId) {
			return collection;
		}
	});
	console.log('this collection', collection);
	const clutch = getClutch.filter((clutch) => {});
};

export const GetPairingRecord = (data) => {
	console.log('this data', data);
};
