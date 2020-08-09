const initialState = {
	listData: {
		_id: '',
		category: '',
		created: '',
		creatorId: '',
		description: '',
		directory: '',
		gender: '',
		images: {
			thumbnail: [],
			large: [],
		},
		list_id: '',
		price: '',
		shipping: '',
		sub_category: '',
		title: '',
		username: '',
		weight: '',
	},
};

const subCategoryListingsInitialState = {
	listings: [],
};

const classified = (state = initialState, listData) => {
	switch (listData.type) {
		case 'CLASSIFIED':
			return {
				...state,
				...listData,
			};
		case 'CLEAR_CLASSIFIED':
			return initialState;
		default:
			return state;
	}
};

export const subCategoryListings = (state = subCategoryListingsInitialState, data) => {
	switch (data.type) {
		case 'New_Listings':
			console.log('some data', data);
			return {
				listings: data.data,
			};
		default:
			return state;
	}
};

export default classified;
