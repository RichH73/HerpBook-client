const initialState = {
	recordType: '',
	display: 'none',
	_id: '',
	date: '',
	_id: '',
	notes: '',
};

const editRecord = (state = initialState, data) => {
	switch (data.type) {
		case 'new_record_edit':
			return {
				...state,
				...data.data,
				// display: data.data.display,
				// recordType: data.data.recordType,
				// _id: data.data._id,
				// date: data.data.date,
				// feederType: data.data.feederType,
				// feederWeight: data.data.feederWeight,
				// notes: data.data.notes
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
