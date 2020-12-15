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
	weights: [],
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

const myCollectionsInitialData = {
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

export const myCollections = (state = myCollectionsInitialData, data) => {
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
		case 'clear_new_animal_data':
			return createNewAnimalInitial;
		default:
			return state;
	}
};

const initialFilterState = {
	cat: '',
	sub_cat: '',
	gender: '',
};

export const myCollectionsFilters = (state = initialFilterState, data) => {
	switch (data.type) {
		case 'NewFilter':
			return {
				...state,
				[data.key]: data.value,
			};
		case 'ClearFilters':
			return initialFilterState;
		default:
			return state;
	}
};
