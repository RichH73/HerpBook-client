const initialState = {
	selectedAnimal: '',
	name: '',
	_id: '',
	dob: '',
	gender: '',
	sire: '',
	dam: '',
	baseImage: '',
	quickRecords: {
		lastShed: '',
		lastFed: '',
		foodType: '',
		weight: '',
	},
	comments: '',
};

const wholeCollectionInitialData = [
	{
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
	},
	{
		name: 'Lizzy',
		_id: '4rt37bec889en9',
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
		comments: 'Mack snow female',
	},
];
const initialSelectedAnimal = {
	id: '',
};

export const viewAnimal = (state = initialState, data) => {
	switch (data.type) {
		case 'display_animal':
			console.log('this animal is', data.selectedAnimal);
			return {
				...state,
			};
		default:
			return state;
	}
};

export const wholeCollection = (state = wholeCollectionInitialData, data) => {
	return state;
};

export const selectedAnimal = (state = initialSelectedAnimal, data) => {
	switch (data.type) {
		case 'new_selected_animal':
			return {
				...state,
				id: data.id,
			};
		default:
			return state;
	}
};
