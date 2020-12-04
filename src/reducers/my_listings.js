const initialState = {
	listings: [],
};

const my_listings = (state = initialState, data) => {
	switch (data.type) {
		case 'my_classifieds':
			console.log(data);
			return {
				...state,
				listings: data.data,
			};
		default:
			return state;
	}
};

export default my_listings;
