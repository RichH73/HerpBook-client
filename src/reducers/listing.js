const initialState = {};
// type: 'listing',
// categories: [],
// sub_categories: [],
// images: [],
// payload: {
// title: '',
// 	description: '',
// 	gender: '',
// 	price: '',
// 	shipping: false,
// 	category: '',
// 	sub_category: '',
// 	categories: [],
// 	sub_categories: [],
// 	},
// };

const listing = (state = initialState, payload) => {
	switch (payload.type) {
		case 'NEW_LISTING':
			return {
				...state,
				[payload.key]: payload.value,
			};
		case 'CATEGORIES':
			return {
				...state,
				categories: payload,
			};
		case 'SUB_CATEGORIES':
			return {
				...state,
				sub_categories: payload,
			};
		case 'CLEAR_LISTING_DATA':
			return initialState;
		default:
			return state;
	}
};

export default listing;
