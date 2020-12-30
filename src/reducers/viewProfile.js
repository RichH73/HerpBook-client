const initialState = {
	User: {
		profile: false,
		username: '',
		uid: '',
		firstName: '',
		lastName: '',
		friends: [],
	},
};

export const PublicProfile = (state = initialState, data) => {
	switch (data.type) {
		case 'New_Profile':
			return {
				...state,
				User: data.data,
			};
		default:
			return state;
	}
};
