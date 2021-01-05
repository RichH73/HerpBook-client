export const loadPairingRecord = (record) => {
	return {
		type: 'View_Pairing_Record',
		record,
	};
};

export const closePairingModal = () => {
	return {
		type: 'Close_Pairing_Modal',
	};
};
export const openPairingModal = () => {
	return {
		type: 'Open_Pairing_Modal',
	};
};
