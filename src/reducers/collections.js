const initialState = {
	name: '',
	_id: '',
	dob: '',
	gender: '',
	sire: '',
	dam: '',
	feedings: [],
	sheddings: [],
	pairings: [],
	images: [],
	quickRecords: {
		feeding: {
			date: '',
			feedType: '',
		},
		pairing: {
			date: '',
		},
	},
	comments: '',
};

const wholeCollectionInitialData = {
	collections: [],
};
const initialSelectedAnimal = {
	id: '',
};

export const viewAnimal = (state = initialState, payload) => {
	console.log('this type', payload.type);
	switch (payload.type) {
		case 'display_animal':
			return {
				...state,
				...payload.data,
			};
		case 'update_animal':
			return {
				...state,
				...payload.data,
			};
		case 'clear_current_animal':
			return initialState;
		default:
			return state;
	}
};

export const wholeCollection = (state = wholeCollectionInitialData, data) => {
	switch (data.type) {
		case 'my_collections_data':
			return {
				collections: data.data,
			};
		default:
			return state;
	}
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

const createNewAnimalInitial = {};

export const createNewAnimal = (state = createNewAnimalInitial, data) => {
	switch (data.type) {
		case 'create_new_animal_data':
			return {
				...state,
				...data.data,
			};
		default:
			return state;
	}
};
