const initial_state = {
	text: '',
	modules: {
		toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['link']['emoji'], // 'image', 'video'],
			['clean'],
		],
		//'emoji-toolbar': true,
		// 'emoji-textarea': false,
		// 'emoji-shortname': true,
	},
	formats: ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'emoji', 'link', 'image', 'video', 'clean'],
	readOnly: false,
	type: 'write',
};

// const clearText = {
// 	text: '',
// };

const richText = (state = initial_state, data) => {
	switch (data.type) {
		case 'new_text':
			return {
				...state,
				text: data.data.text,
			};
		case 'clear_rich_text':
			return {
				...state,
				text: '',
			};
		default:
			return state;
	}
};

export default richText;
