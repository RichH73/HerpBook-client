import React from 'react';
import CryptoJS from 'crypto-js';

export const Encrypt = (data) => {
	var unencryptedata = JSON.stringify(data);
	const encryptedData = CryptoJS.AES.encrypt(unencryptedata, 'secret key 123').toString();
	return encryptedData;
};

export const Decrypt = (data) => {
	const encryptedData = CryptoJS.AES.decrypt(data, 'secret key 123');
	const unencryptedata = encryptedData.toString(CryptoJS.enc.Utf8);
	const parsedString = JSON.parse(unencryptedata);
	return parsedString;
};
