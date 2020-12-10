import axios from 'axios';
import config from '../reducers/config';

//import { Base64 } from 'js-base64';
const API = config().server.serverAPI;

export const my_classifieds_data = (data) => {
	return {
		type: 'my_classifieds',
		data,
	};
};

export const new_clutch_data = (data) => {
	return {
		type: 'create_new_clutch',
		data,
	};
};

export const current_clutch_data = (data) => {
	return {
		type: 'view_clutch',
		data,
	};
};

export const all_clutch_data = (data) => {
	return {
		type: 'all_clutches',
		data,
	};
};

export const newBarCode = (data) => {
	return {
		type: 'new_scan',
		data,
	};
};

export const barTest = (data) => {
	return {
		type: 'set_bar_img',
		data,
	};
};

export const clearRecordsEditor = () => {
	return {
		type: 'clear_record_edit',
	};
};

export const recordsEditor = (data) => {
	return {
		type: 'record_edit_new_data',
		data,
	};
};

export const loadrecordsEditor = (data) => {
	return {
		type: 'new_record_edit',
		data,
	};
};

export const modalSetState = (state) => {
	return {
		type: 'modal_state',
		state,
	};
};

export const setPageTitle = (pageTitle) => {
	return {
		type: 'PageTitle',
		pageTitle,
	};
};

// Collections animal change
export const animalUpdate = (data) => {
	return {
		type: 'update_animal',
		data,
	};
};

// Large Image Display
export const displayLargeImage = (data) => {
	return {
		type: 'floating_image',
		display: data.display,
		img: data.img,
		name: data.name,
	};
};
export const hideLargeImage = () => {
	return {
		type: 'floating_image',
		display: 'none',
		img: '',
		name: '',
	};
};
// Large Image END

// Collections

export const setCurrentAnimal = (id) => {
	return {
		type: 'new_selected_animal',
		id,
	};
};

export const createAnimalData = (data) => {
	return {
		type: 'create_new_animal_data',
		data,
	};
};

const loadMyCollections = (data) => {
	return {
		type: 'my_collections_data',
		data,
	};
};

export const currentAnimalDisplay = (data) => {
	return {
		type: 'display_animal',
		data,
	};
};

export const clearCurrentAnimalDisplay = (data) => {
	return {
		type: 'clear_current_animal',
		data,
	};
};

export const getMyCollections = (data) => {
	return function (dispatch) {
		dispatch(pageLoading(true));
		setTimeout(() => {
			dispatch(pageLoading(false));
		}, 8000);
		axios({
			method: 'post',
			url: `${API}/collections/my_collections`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {},
		})
			.then((response) => {
				dispatch(pageLoading(false));
				dispatch(loadMyCollections(response.data.collections));
				dispatch(all_clutch_data(response.data.clutches));
			})
			.catch((error) => {
				if (error) console.log(error);
			});
	};
};

export const quickCollection = (id) => {
	return function (dispatch) {
		dispatch(loadMyCollections(id));
	};
};

// End Collections

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

export const setSocketID = (data) => {
	return {
		type: 'updatingsocket',
		data,
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

export const shameText = (data) => {
	return {
		type: 'INCIDENT_DESCRIPTION',
		data,
	};
};
export const newShameComment = (data) => {
	return {
		type: 'SHAME_COMMENT',
		data,
	};
};

export const shameReportComment = (data) => {
	return {
		type: 'pushComment',
		data,
	};
};

export const newShames = (data) => {
	return {
		type: 'SHAMES',
		shames: data,
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

export const newUserMail = (mailData) => {
	// console.log('some mail data', mailData)
	return {
		type: 'NEW_MAIL',
		mailData,
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

// Spinner location tools.js
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

export const fileNewReport = (key, value) => {
	return {
		type: 'FILE_REPORT',
		key,
		value,
	};
};

export const getMyProfile = (data) => {
	return function (dispatch) {
		pageLoading(true);
		setTimeout(() => {
			dispatch(pageLoading(false));
		}, 10000);
		axios({
			method: 'post',
			url: `${API}/users/my_profile`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				uid: data,
			},
		}).then((response) => {
			if (response.status === 200) {
				dispatch(pageLoading(false));
				dispatch(user_login(response.data));
			}
		});
	};
};
