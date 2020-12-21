import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import _ from 'lodash';
import ReactQuill, { Quill } from 'react-quill';
import ImageCompress from 'quill-image-compress';
import '../Messages.css';
import socket from '../../../../_services/SocketService';

Quill.register('modules/imageCompress', ImageCompress);

class MailReply extends React.Component {
	quill = new Quill('.editor', {
		// ...
		modules: {
			// ...
			imageCompress: {
				quality: 0.7, // default
				maxWidth: 1000, // default
				maxHeight: 1000, // default
				imageType: 'image/jpeg', // default
				debug: false, // default
			},
		},
	});

	modules = {
		imageCompress: {
			quality: 0.7, // default
			maxWidth: 400, // default
			maxHeight: 400, // default
			imageType: 'image/jpeg', // default
			debug: false, // default
		},
		toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['link', 'image', 'video'],
		],
	};

	formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video', 'clean'];

	componentWillUnmount() {
		this.props.clearRichText();
	}

	onChangeHandler = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	messageText = (value) => {
		this.props.editText({
			text: value,
		});
	};

	submitHandler = (event) => {
		event.preventDefault();
		const { subject } = this.props.data;
		socket.emit('mail', {
			eventType: 'createMail',
			uid: this.props.userInfo.uid,
			authToken: localStorage.token,
			socketID: socket.id,
			headers: {
				recipient: this.props.data.from._id,
				from: this.props.userInfo.uid,
			},
			newMailMessage: {
				from: this.props.userInfo.uid,
				sent: new Date(),
				subject: _.includes(subject, 'RE:') ? subject : `RE: ${subject}`,
				body: this.props.text,
			},
		});
		socket.on('mailStatus', (status) => {
			if (status === 201) this.props.history.push('/my_mail');
		});
	};

	render() {
		return (
			<div className="message-reply-contact_form">
				<form onSubmit={this.submitHandler}>
					<fieldset className="form-group">
						<legend className="border-bottom form_space">Contact Seller</legend>

						<div id="div_id_from_subject" className="form-group">
							<label name="id_subject" className="col-form-label  requiredField">
								<span>Subject: {_.includes(this.props.data.subject, 'RE:') ? this.props.data.subject : `RE: ${this.props.data.subject}`}</span>
							</label>
						</div>

						<div>
							<img src={this.props.picture} alt={this.props.picture} />
						</div>

						<div className="form-row field-message">
							<label name="message">
								Message
								<span className="asterickField">*</span>
							</label>
						</div>

						<div className="message-reply-form-group" id="id_message_box">
							<div style={{ backgroundColor: 'white' }}>
								<ReactQuill
									style={{ backgroundColor: 'white', color: 'black' }}
									name="message"
									value={this.props.text}
									onChange={this.messageText}
									modules={this.props.mods.modules}
									formats={this.props.mods.formats}
									readOnly={false}
									theme="snow"
								/>
							</div>
						</div>
					</fieldset>
					<div style={{ textAlign: 'right' }}>
						<button disabled={!!this.props.text ? false : true} type="submit" className="message-reply-button button">
							Send
						</button>
					</div>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		data: state.messageReply,
		API: state.config.server.serverAPI,
		URL: state.config.server.serverURL,
		USERSURL: state.config.server.usersURL,
		myUid: state.user.uid,
		text: state.richText.text,
		mods: state.richText,
		userInfo: state.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MailReply);
