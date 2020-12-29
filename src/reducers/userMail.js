const initialState = {
	mailCount: 0,
	inbox: [],
	sentItems: [],
	mailData: {},
};

const userMail = (state = initialState, data) => {
	switch (data.type) {
		case 'NEW_MAIL':
			return {
				...state,
				mailCount: data.mailData.mailCount,
				inbox: data.mailData.inbox,
				sentItems: data.mailData.sentItems,
			};
		case 'View_Mail_Message':
			return {
				...state,
				mailData: data.data,
			};
		case 'Editing_Mail_Message':
			return {
				...state,
				mailData: {
					...state.mailData,
					[data.key]: data.value,
				},
			};

		// case 'DELETE_MESSAGE':
		// 	return {
		// 		...state,
		// 		messages: state.messages.filter((message) => message._id !== data.id),
		// 		messageCount: state.messageCount - 1,
		// 	};

		// case 'message_seen':
		// 	return {
		// 		...state,
		// 		//messages: state.messages.filter(message => message._id !== data.id),
		// 		//messages: state.messages.filter(message => message._id).set(message, 'seen', new Date()),
		// 		// messages: state.messages,
		// 		messageCount: state.messageCount - 1,
		// 	};

		// case 'SEND_MESSAGE':
		// 	return {
		// 		...state,
		// 		touid: data.touid,
		// 		// fromuid: data.data.fromuid,
		// 		// message: data.data.message,
		// 		// subject: data.data.subject
		// 	};

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

export default userMail;
