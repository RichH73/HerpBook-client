import { pageLoading, all_clutch_data, loadMyCollections, API } from './index';
import axios from 'axios';

export const closeEditClutch = () => {
	return {
		type: 'Close_Clutch_Editor',
	};
};

export const newCollectionsFilter = (filter) => {
	return {
		type: 'New_Collection_Filter',
		filter,
	};
};

export const loadClutch = (data) => {
	return {
		type: 'Clutch_Edit_Data',
		data,
	};
};

export const new_clutch_data = (data) => {
	return {
		type: 'create_new_clutch',
		data,
	};
};

export const clutchesPairingRecordEdit = (data) => {
	return {
		type: 'Pairing_Record_Value',
		data,
	};
};

export const clutchRecordEdit = (data) => {
	return {
		type: 'Clutch_Record_Value',
		data,
	};
};

export const getMyClutches = (data) => {
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

export const updateClutch = (data) => {
	return function (dispatch) {
		dispatch(pageLoading(true));
		setTimeout(() => {
			dispatch(pageLoading(false));
		}, 8000);
		axios({
			method: 'post',
			url: `${API}/clutches/update_clutch_record`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: data,
		})
			.then((response) => {
				dispatch(pageLoading(false));
				console.log('response from update', response);
				if (response.status === 201) {
					dispatch(all_clutch_data(response.data));
				}
			})
			.catch((error) => {
				if (error) console.log(error);
			});
	};
};

export const newHatchling = (data) => {
	return function (dispatch) {
		dispatch(pageLoading(true));
		setTimeout(() => {
			dispatch(pageLoading(false));
		}, 8000);
		axios({
			method: 'post',
			url: `${API}/clutches/create_hatchling`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: data,
		})
			.then((response) => {
				dispatch(pageLoading(false));
				console.log('response from update', response);
				if (response.status === 201) {
					dispatch(all_clutch_data(response.data));
				}
			})
			.catch((error) => {
				if (error) console.log(error);
			});
	};
};
