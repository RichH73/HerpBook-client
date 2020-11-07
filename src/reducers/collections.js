const initialState = {
	name: 'Perry',
	_id: '5ef87bec889en9',
	dob: '02/20/20',
	gender: 'male',
	sire: '',
	dam: '47ef87bec889en9',
	quickRecords: {
		lastShed: '10/23/20',
		lastFed: '11/4/20',
		foodType: 'Superworms',
	},
	comments: 'Some different comments to list in a box that should list some comments',
};

const animal = (state = initialState, data) => {
	switch (data.type) {
		case 'display_animal':
			return {
				...state,
			};
		default:
			return state;
	}
};

export default animal;
