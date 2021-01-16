import ReactQuill, { Quill } from 'react-quill';
//import Quill from 'quill'
import ImageCompress from 'quill-image-compress';

Quill.register('modules/imageCompress', ImageCompress);

const initial_state = {
	text: '',
	modules: {
		imageCompress: {
			quality: 0.7, // default
			maxWidth: 400, // default
			maxHeight: 400, // default
			imageType: 'image/jpeg', // default
			debug: false, // default
		},
		toolbar: [
			[{ header: [1, 2, 3, 4, 5, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ align: [] }],
			[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['link', 'image', 'video'],
			['emoji'], // 'image', 'video'],
			['clean'],
		],
		'emoji-toolbar': true,
		'emoji-textarea': false,
		'emoji-shortname': false,
	},
	formats: [
		'header',
		'bold',
		'italic',
		'underline',
		'align',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'indent',
		'emoji',
		'link',
		'image',
		'video',
		'clean',
	],
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
