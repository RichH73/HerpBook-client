const initial_state = {
	albums: [],
};

const cleared_state = initial_state;

const pictures = (state = initial_state, data) => {
	switch (data.type) {
		case 'albums':
			return {
				//...state,
				albums: data.data,
			};

		case 'clear_props':
			return cleared_state;

		default:
			return state;
	}
};

export default pictures;
