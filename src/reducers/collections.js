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
	comments: '',
};

const wholeCollectionInitialData = {
	collections: [],
};
const initialSelectedAnimal = {
	id: '',
};

export const viewAnimal = (state = initialState, data) => {
	switch (data.type) {
		case 'display_animal':
			return {
				...state,
				...data.data,
			};
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
