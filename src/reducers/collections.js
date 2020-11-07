const initialState = {
	name: 'Perry',
	_id: '5ef87bec889en9',
	dob: '02/20/20',
	gender: 'male',
	sire: '',
	dam: '47ef86bec891cn5',
	quickRecords: {
		lastShed: '10/23/20',
		lastFed: '11/4/20',
		foodType: 'Superworms',
		weight: '64g',
	},
	comments: 'He has paradox markings in front of both shoulders.',
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
