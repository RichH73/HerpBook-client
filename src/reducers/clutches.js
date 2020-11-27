const initialState = {
	_id: '',
};

const initialClutches = {
	_id: '',
};

const initialAllClutches = [];

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
				...data.data,
			};
		default:
			return state;
	}
};
