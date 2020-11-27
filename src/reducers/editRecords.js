const initialState = {
	recordType: '',
	display: 'none',
	_id: '',
	date: '',
	notes: '',
};

const editRecord = (state = initialState, data) => {
	switch (data.type) {
		case 'new_record_edit':
			return {
				...state,
				...data.data,
			};
		case 'record_edit_new_data':
			return {
				...state,
				...data.data,
			};
		case 'clear_record_edit':
			return initialState;
		default:
			return state;
	}
};

export default editRecord;
