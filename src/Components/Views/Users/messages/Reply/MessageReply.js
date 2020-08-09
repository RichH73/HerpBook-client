import React from 'react';
import axios from 'axios';
//import './MessageReply.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import _ from 'lodash';
import ReactQuill from 'react-quill';
class SellerContactForm extends React.Component {
	modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['link'],
		],
	};

	formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link'];

	componentWillUnmount() {
		this.props.clearRichText();
	}

	onChangeHandler = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	messageText = (value) => {
		//this.props.userInfoUpdate('businessFooter', text);
		this.props.editText({
			text: value,
		});
	};

	submitHandler = (event) => {
		event.preventDefault();
		/*
                  _id(pin):""
                  fromusername(pin):""
                  tousername(pin):""
                  touid(pin):""
                  subject(pin):""
                  message(pin):""
                  seen(pin):""
                  created(pin):""

                */
		const { fromusername, tousername, touid, subject } = this.props.data;
		axios({
			method: 'post',
			url: `${this.props.API}/messages/send_message`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				message: this.props.text,
				subject: _.includes(subject, 'RE:') ? subject : `RE: ${subject}`,
				touid: touid,
				tousername: tousername,
				fromuid: this.props.myUid,
				fromusername: fromusername,
			},
		}).then((res) => {
			if (res.status === 201) {
				this.props.history.push('/success');
			} else {
				alert('Oops! Something went wrong, please try again.');
			}
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

						<div className="form-group" id="id_message_box">
							<div style={{ backgroundColor: 'white' }}>
								{/* <Editor settings={{ modules: this.modules, formats: this.formats }} /> */}
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
							{/* <textarea name="message" cols="65" rows="10" className="vLargeTextField" maxLength="1000" id="id_message" onChange={this.onChangeHandler}/> */}
						</div>

						{/* <div id="div_id_message" className="form-group">
          <label name="id_to_name" className="col-form-label requiredField">
            To: 
            {this.props.seller}
          </label>
        </div> */}
					</fieldset>
					<div style={{ textAlign: 'right' }}>
						<button type="submit" className="btn btn-success">
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
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SellerContactForm);
