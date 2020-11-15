const initialState = {
	recordType: '',
	display: 'none',
	_id: '',
};

const editRecord = (state = initialState, data) => {
	switch (data.type) {
		case 'new_record_edit':
			return {
				...state,
				display: data.data.display,
				recordType: data.data.recordType,
				_id: data.data._id,
				recordData: data.data.record,
			};
		default:
			return state;
	}
};

export default editRecord;
