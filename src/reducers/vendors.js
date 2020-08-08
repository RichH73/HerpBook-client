const initial_state = ['No vendors listed'];

const Vendors = (state = initial_state, data) => {
	switch (data.type) {
		case 'vendor_list':
			return {
				breeders: data.data[0],
			};
		default:
			return state;
	}
};

export default Vendors;
