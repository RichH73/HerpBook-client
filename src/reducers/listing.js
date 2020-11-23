const initialState = {
	price: '$0.00',
};

const listing = (state = initialState, listing) => {
	switch (listing.type) {
		case 'NEW_LISTING':
			return {
				...state,
				[listing.key]: listing.value,
			};
		case 'CATEGORIES':
			return {
				...state,
				categories: listing,
			};
		case 'SUB_CATEGORIES':
			return {
				...state,
				sub_categories: listing,
			};
		case 'CLEAR_LISTING_DATA':
			return initialState;
		default:
			return state;
	}
};

export default listing;
