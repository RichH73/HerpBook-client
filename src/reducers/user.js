const initialState = {
	uid: '',
	socketId: '',
	userSocket: false,
	socialMedia: {},
	my_friends: [],
};

const clear_state = {
	uid: '',
	socketId: '',
	socketId: '',
	socialMedia: {},
	my_friends: [],
};

const user = (state = initialState, user) => {
	switch (user.type) {
		case 'LOG_IN':
			return {
				...state,
				...user,
			};

		case 'about_update':
			return {
				...state,
				about: user.about.about,
			};

		case 'updatingsocket':
			return {
				...state,
				socketId: user.data,
			};

		case 'LOG_OUT':
			return {
				...initialState,
			};

		case 'updateProfile':
			return {
				...state,
				...user,
				[user.key]: user.value,
			};
		case 'CLEAR_PROFILE':
			return clear_state;
		case 'RELOAD_PROFILE':
			return { uid: state.uid };
		case 'NEW_USER_DATA':
			return {
				...state,
				...user.user,
			};
		case 'newProfileImage':
			return {
				...state,
				...user,
				newProfilePic: user.imageName,
			};
		default:
			return state;
	}
};
export default user;
