import _ from 'lodash';

const initialState = {
	uid: '',
	// username: 'anonymous',
	// usrlvl: '',
	// first_name: '',
	// last_name: '',
	// entityEmail: '',
	// entityEmailType: '',
	displayEntityEmail: false,
	// entityPhoneNumber: '',
	// entityPhoneType: '',
	displayEntityPhone: false,
	// about: '',
	// image: '',
	// token: '',
	// street: '',
	// city: '',
	// state: '',
	// zip_code: '',
	// website: '',
	// business_name: '',
	// is_this_a_business: '',
	// display_address: '',
	// lastLogin: '',
	// my_friends: [],
	business: false,
};

const clear_state = initialState;

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

		case 'LOG_OUT':
			return {
				initialState,
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
