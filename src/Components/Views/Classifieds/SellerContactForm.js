import React from 'react';
import axios from 'axios';
//import "../contact/Contact.css";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import _ from 'lodash';
import ReactQuill from 'react-quill';

//Google analytics
import ReactGA from 'react-ga';

class SellerContactForm extends React.Component {
	modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['link', 'image', 'video'],
			['clean'],
		],
	};

	formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video'];

	componentDidMount() {
		ReactGA.pageview(`/message-seller/${this.props.seller}`);
	}

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

	handleChange = (value) => {};

	submitHandler = (event) => {
		// const thisData = {
		//   message: this.state.message,
		//   subject: this.props.title,
		//   receiver: this.props.seller,
		//   sender: this.props.sender,
		//   sender_name: this.props.senderName
		// };
		event.preventDefault();
		axios({
			method: 'post',
			url: `${this.props.API}/messages/send_message/`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				message: this.props.text,
				tousername: this.props.seller,
				touid: this.props.location.userToUid, //this.props.touid,
				subject: `${this.props.location.listSubject} (Message from visitor)`,
				receiver: this.props.seller,
				fromuid: localStorage.uid,
				fromusername: this.props.sender_name,
			},
		}).then((res) => {
			// eslint-disable-next-line
			if (res.status === 201) {
				this.props.history.push('/success/classifiedcontact');
			} else {
				alert('Oops! Something went wrong, please try again.');
			}
		});
	};

	render() {
		// eslint-disable-next-line
		const { sellerData } = _.get(this, 'props.location', {}); //this.props.location.sellerData || '
		return (
			<div id="contact_form">
				<form onSubmit={this.submitHandler}>
					<fieldset className="form-group">
						<legend className="border-bottom form_space">Contact Seller</legend>

						<div id="div_id_from_subject" className="form-group">
							<label name="id_subject" className="col-form-label  requiredField">
								<span>Subject: {this.props.location.listSubject} (Message from visitor)</span>
							</label>
						</div>
						<div>
							{/* <img src={`${this.props.USERSURL}/${_.get(sellerData, 'username')}/classifieds/${_.get(sellerData, 'directory')}/${_.get(sellerData, 'images.thumbnail.0')}`} alt='' /> */}
						</div>

						<div className="form-row field-message">
							<label name="message">
								Message
								<span className="asterickField">*</span>
							</label>
						</div>

						<div className="form-group" id="id_message_box">
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

						{/* <div id="div_id_message" className="form-group">
          <label name="id_to_name" className="col-form-label requiredField">
            To: 
            {this.props.seller}
          </label>
        </div> */}
					</fieldset>

					<button type="submit" className="btn btn-success button">
						Send
					</button>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		text: state.richText.text,
		seller: state.classified.listData.user,
		//touid: state.classified.listData.creatorId,
		sender: state.user.user,
		title: state.classified.listData.title,
		picture: state.classified.listData.picture,
		messageSender: state.user.user,
		sender_name: state.user.username,
		API: state.config.server.serverAPI,
		USERSURL: state.config.server.usersURL,
		mods: state.richText,
		RichText: state.richText.text,
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SellerContactForm);
