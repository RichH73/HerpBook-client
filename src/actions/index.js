import axios from 'axios';
import config from '../reducers/config';
//import { Base64 } from 'js-base64';
const API = config().server.serverAPI;

export const setPageTitle = (pageTitle) => {
	return {
		type: 'PageTitle',
		pageTitle,
	};
};

// Vedors listings
export const vendorList = (data) => {
	return {
		type: 'vendor_list',
		data: [data],
	};
};

export const getVendors = () => {
	return function (dispatch) {
		axios({
			method: 'get',
			url: `${API}/breeders/list`,
			// url: `${serverAPI}/breeders/list`
		})
			.then((response) => {
				dispatch(vendorList(response.data));
				return;
			})
			.catch((error) => {
				console.log(error);
			});
	};
};

export const user_login = (user) => {
	return {
		type: 'LOG_IN',
		...user,
		// uid: _.get(user, 'uid'),
		// usrlvl: _.get(user, 'usrlvl'),
		// token: _.get(user, 'token'),
		// username: _.get(user, 'username'),
		// email: _.get(user, 'email'),
		// about: _.get(user, 'about'),
		// profile_pic: _.get(user, 'profile_pic'),
		// first_name: _.get(user, 'first_name'),
		// last_name: _.get(user, 'last_name'),
		// last_login: _.get(user, 'last_login'),
		// business_name: _.get(user, 'business_name'),
		// website: _.get(user, 'website'),
		// address: _.get(user, 'address'),
		// street: _.get(user, 'street'),
		// city: _.get(user, 'city'),
		// state: _.get(user, 'state'),
		// zip_code: _.get(user, 'zip_code'),
		// is_this_a_business: _.get(user, 'is_this_a_business'),
		// display_address: _.get(user, 'display_address'),
		// my_friends: _.get(user, 'my_friends', []),
	};
};

export const userLogOut = () => {
	return {
		type: 'LOG_OUT',
	};
};

export const token_login = () => {
	return function (dispatch) {
		axios({
			method: 'get',
			url: `${API}/login/token/`,
			headers: { Authorization: `Bearer ${localStorage.token}` },
		})
			.then((response) => {
				dispatch(user_login(response.data));
				return;
			})
			.catch((error) => {
				console.log(error);
			});
	};
};

export const userInfoUpdate = (key, value) => {
	return {
		type: 'updateProfile',
		key,
		value,
	};
};

export const imagesUploaded = () => ({
	type: 'RESET',
});

export const clear_profile = () => {
	return {
		type: 'CLEAR_PROFILE',
	};
};

export const imageHandler = (files) => {
	return {
		type: 'NEW_IMAGES',
		images: files.files,
		sendFiles: files.sendFiles,
		image_array: files.image_array,
	};
};

export const user_lookup = (data) => {
	return {
		type: 'USER_LOOKUP',
		data,
	};
};

export const get_user = (data) => {
	return function (dispatch) {
		axios({
			method: 'post',
			url: `${API}/users/view_profile`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				userId: data.uid,
			},
		}).then((response) => {
			dispatch(user_lookup(response.data));
		});
	};
};

export const classified = (listData) => {
	return {
		type: 'CLASSIFIED',
		listData,
	};
};

export const deleteImages = (path) => ({
	type: 'DELETE_IMAGE',
	path,
});

export const newListing = (key, value) => {
	return {
		type: 'NEW_LISTING',
		key,
		value,
	};
};

export const clearListingData = () => {
	return {
		type: 'CLEAR_LISTING_DATA',
	};
};

export const editText = (data) => {
	return {
		type: 'new_text',
		data,
	};
};

export const clearClassifiedData = () => {
	return {
		type: 'CLEAR_CLASSIFIED',
	};
};

export const clearRichText = () => {
	return {
		type: 'clear_rich_text',
	};
};

/*
Messages functions for user in app messages.
*/
export const newMessages = (message) => {
	return {
		type: 'NEW_MESSAGES',
		messageCount: message.messageCount,
		messages: message.messages,
	};
};

export const deleteMessage = (id) => ({
	type: 'DELETE_MESSAGE',
	id,
});

export const messageReply = (messageData) => {
	return {
		type: 'MESSAGE_REPLY',
		messageData,
	};
};

export const sendMessage = (key, value) => {
	return {
		type: 'SEND_MESSAGE',
		key,
		value,
	};
};

export const pageLoading = (spinner) => {
	return {
		type: 'SPINNER_STATE',
		spinner,
	};
};

export const getSubCategoryListings = (data) => {
	return {
		type: 'New_Listings',
		data,
	};
};

export const reloadProfile = () => {
	return {
		type: 'RELOAD_PROFILE',
	};
};

// const newUserData = (user) => {
// 	return {
// 		type: 'NEW_USER_DATA',
// 		user,
// 	};
// };

// export const liveProfileUpdate = (user, history) => {
// 	return function (dispatch) {
// 		axios({
// 			method: 'post',
// 			url: `${API}/users/update_profile`,
// 			headers: {
// 				Authorization: `Bearer ${localStorage.token}`,
// 				//uid: localStorage.uid,
// 				//username: this.props.username,
// 				//enctype: "mylipart/form-data"
// 			},
// 			data: user,
// 		}).then((userResponse) => {
// 			// dispatch(vendorList(userResponse.data));
// 			dispatch(imagesUploaded());
// 			const user = JSON.parse(Base64.decode(userResponse.data.token.split('.')[1]));
// 			localStorage.setItem('token', _.get(userResponse, 'data.token'));
// 			dispatch(reloadProfile());
// 			dispatch(newUserData(userResponse.data.user));
// 			dispatch(user_login(userResponse.data.user));
// 			return history.push('/success/profileUpdate');
// 		});
// 	};
// };

export const newProfilePic = (imageName) => {
	return {
		type: 'newProfileImage',
		imageName,
	};
};
