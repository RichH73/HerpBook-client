const initialState = {
	messageCount: 0,
	messages: [],
};

const messages = (state = initialState, action) => {
	switch (action.type) {
		case 'NEW_MESSAGES':
			return {
				...state,
				messageCount: action.messageCount,
				messages: action.messages,
			};

		case 'DELETE_MESSAGE':
			return {
				...state,
				messages: state.messages.filter((message) => message._id !== action.id),
				messageCount: state.messageCount - 1,
			};

		case 'message_seen':
			return {
				...state,
				//messages: state.messages.filter(message => message._id !== action.id),
				//messages: state.messages.filter(message => message._id).set(message, 'seen', new Date()),
				// messages: state.messages,
				messageCount: state.messageCount - 1,
			};

		case 'SEND_MESSAGE':
			return {
				...state,
				touid: action.touid,
				// fromuid: action.data.fromuid,
				// message: action.data.message,
				// subject: action.data.subject
			};

		default:
			return state;
	}
};

export const sendMessage = (state = initialState, data) => {
	switch (data.type) {
		case 'SEND_MESSAGE':
			return {
				// ...state,
				// data:{
				...state,
				[data.key]: data.value,
				// }
			};
		default:
			return state;
	}
};

export default messages;
