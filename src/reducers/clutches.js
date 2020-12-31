const initialState = {
	_id: '',
};

const initialClutches = {
	cluthes: [],
};

const initialAllClutches = {
	clutchData: [],
	editClutch: {},
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
			console.log(data);
			return {
				...state,
				clutchData: data.data,
			};
		case 'Clutch_Edit_Data':
			return {
				...state,
				editClutch: data.data,
			};
		default:
			return state;
	}
};
