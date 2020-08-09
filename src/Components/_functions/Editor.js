import React, { Component } from 'react';
import ReactQuill from 'react-quill';
// import quillEmoji from 'quill-emoji';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/index';

class Editor extends Component {
	//Pass the folling object as editorProps when calling <Editor/>

	editorProps = {
		modules: {
			toolbar: [
				[{ header: [1, 2, false] }],
				['bold', 'italic', 'underline', 'strike', 'blockquote'],
				[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
				['link', 'image', 'video'],
				['emoji'],
				['clean'],
			],
			'emoji-toolbar': true,
			'emoji-textarea': false,
			'emoji-shortname': true,
		},
		formats: [
			'header',
			'bold',
			'italic',
			'underline',
			'strike',
			'blockquote',
			'list',
			'bullet',
			'indent',
			'emoji',
			//'link', 'image', 'video', 'clean'
		],
		readOnly: false,
		type: 'write',
	};

	modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['link', 'image', 'video'],
			['clean'],
		],
		// 'emoji-toolbar': true,
		// 'emoji-textarea': false,
		// 'emoji-shortname': true,
	};

	formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video', 'emoji', 'clean'];

	allModules = {
		modules: {
			toolbar: [
				[{ header: [1, 2, false] }],
				['bold', 'italic', 'underline', 'strike', 'blockquote'],
				[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
				['link', 'image', 'video'],
				['emoji'],
				['clean'],
			],
			'emoji-toolbar': true,
			'emoji-textarea': false,
			'emoji-shortname': true,
		},
		formats: [
			'header',
			'bold',
			'italic',
			'underline',
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

	handleChange = (value) => {
		this.props.editText({
			text: value,
		});
	};

	render() {
		// console.log('this modules', this.modules)
		// // eslint-disable-next-line
		// const { modules, formats, readOnly, value, type, theme } = this.props;
		// console.log('incoming modules', this.props.mods.modules)
		return (
			<React.Fragment>
				<ReactQuill
					style={{ backgroundColor: 'white', color: 'black' }}
					name="quil"
					value={this.props.about}
					onChange={this.handleChange}
					modules={this.props.mods.modules}
					formats={this.props.mods.formats}
					readOnly={false}
					theme="snow"
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	about: state.user.about,
	text: state.richText.text,
	currentText: state.richText.text,
	mods: state.richText,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
