const initialState = {
	_id: '',
	fromusername: '',
	tousername: '',
	touid: '',
	subject: '',
	message: '',
	seen: '',
	created: '',
};
const messageReply = (state = initialState, action) => {
	switch (action.type) {
		case 'MESSAGE_REPLY':
			return {
				...state,
				...action.messageData,
			};

		default:
			return state;
	}
};

export default messageReply;
