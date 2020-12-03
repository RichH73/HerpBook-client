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
	isClassified: false,
	classifiedData: {
		_id: '',
		title: '',
		price: '',
		display_feedings: true,
		display_sheddings: true,
		display_weights: true,
		display_pairings: true,
	},
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
	readOnly: true,
};

const wholeCollectionInitialData = {
	collections: [],
};
const initialSelectedAnimal = {
	id: '',
};

export const viewAnimal = (state = initialState, payload) => {
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

const createNewAnimalInitial = {
	category: '',
	sub_category: '',
};

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
