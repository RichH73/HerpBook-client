const initialState = {
	_id: '',
};

const initialClutches = {
	cluthes: [],
};

const initialAllClutches = {
	clutchData: [],
	editClutch: {
		hatchlings: [],
		deleteClutchModal: true,
	},
	pairingRecord: {},
	pairingModal: false,
	filters: {
		sire: '',
		dam: '',
	},
};

export const new_clutch = (state = initialState, data) => {
	switch (data.type) {
		case 'create_new_clutch':
			return {
				...state,
				...data.data,
			};
		default:
			return state;
	}
};

export const current_clutch = (state = initialClutches, data) => {
	switch (data.type) {
		case 'view_clutch':
			console.log('now the reducer', data);
			return {
				...state,
				...data.data,
			};
		default:
			return state;
	}
};

export const my_clutches = (state = initialAllClutches, data) => {
	switch (data.type) {
		case 'all_clutches':
			return {
				...state,
				clutchData: data.data,
			};
		case 'Clutch_Edit_Data':
			return {
				...state,
				editClutch: data.data,
			};
		case 'Close_Clutch_Editor':
			return {
				...state,
				editClutch: {
					deleteClutchModal: false,
				},
			};
		case 'View_Pairing_Record':
			return {
				...state,
				pairingRecord: data.record,
			};
		case 'Close_Pairing_Modal':
			return {
				...state,
				pairingModal: false,
			};
		case 'Open_Pairing_Modal':
			return {
				...state,
				pairingModal: true,
			};
		case 'New_Collection_Filter':
			return {
				...state,
				filters: {
					...state.filters,
					...data.filter,
				},
			};
		case 'Pairing_Record_Value':
			return {
				...state,
				pairingRecord: {
					...state.pairingRecord,
					...data.data,
				},
			};
		case 'Clutch_Record_Value':
			return {
				...state,
				editClutch: {
					...state.editClutch,
					...data.data,
				},
			};
		default:
			return state;
	}
};
