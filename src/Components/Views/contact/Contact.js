import React from 'react';
import './Contact.css';
import axios from 'axios';
import Recaptcha from 'react-recaptcha';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';

class Contact extends React.Component {
	state = {
		email: '',
		subject: '',
		message: '',
		to_admin: 1,
		isVerified: false,
	};

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	submitHandler = async (event) => {
		let user = this.props.userInfo;
		let userData = `<div>
		  <div>
		  <p>Form Submission information.<p>
		  <div>Form Email: ${this.state.email}</div>
		  <div>Form Subject: ${this.state.subject}</div>
		  </div>
			${
				!!user.uid
					? `<div>
				<p>Contact was logged in when form was submitted. Here is the users info.<p>
				  <div>User ID: ${user.uid}</div>
				  <div>User Name: ${user.username}</div>
				  <div>User Email: ${user.entityEmail}</div>
				  <div>User First Name: ${user.firstName}</div>
				  <div>User Last Name: ${user.lastName}</div>
				</div>`
					: '<div><p>No user logged in.</p></div>'
			}
		  </div>`;
		event.preventDefault();
		if (this.state.isVerified) {
			await axios({
				method: 'post',
				url: `${this.props.API}/contact`,
				responseType: 'json',
				data: {
					subject: `(Contact Submission) ${this.state.subject}`,
					email: this.state.email,
					message: this.state.message,
					userData: userData,
				},
			})
				.then((response) => {
					if (response.status === 200) {
						this.props.history.push('/success/sitecontact');
					}
				})
				.catch((err) => {
					alert('Oops something went wrong!', err);
				});
		} else {
			alert('Please verify you are human.');
		}
	};

	verifyCallback = (response) => {
		if (response) {
			this.setState({ isVerified: true });
		}
	};
	render() {
		return (
			<div id="contact_form">
				<form onSubmit={this.submitHandler}>
					<div className="form-group form-group-sm">
						<fieldset className="form-group">
							<legend className="border-bottom form_space">Contact Us</legend>

							<div id="div_id_from_email" className="form-group">
								<label id="id_from_email" className="col-form-label  requiredField">
									Email Address<span className="asteriskField">*</span>
								</label>
							</div>

							<div className="form-group">
								<input type="email" name="email" className="emailinput form-control" required id="id_from_email" onChange={this.handleChange} />
							</div>

							<div id="div_id_subject" className="form-group">
								<label id="id_subject" className="col-form-label  requiredField">
									Subject<span className="asteriskField">*</span>
								</label>
							</div>

							<div className="form-group">
								<input
									type="text"
									name="subject"
									className="textinput form-control"
									required
									id="subject"
									value={this.state.subject}
									onChange={this.handleChange}
								/>
							</div>

							<div id="div_id_message" className="form-group">
								<label id="id_message" className="col-form-label  requiredField">
									Message<span className="asteriskField">*</span>
								</label>
							</div>

							<div className="">
								<textarea
									name="message"
									cols="45"
									rows="5"
									className="textarea form-control form-group-sm"
									required
									id="message"
									value={this.state.message}
									onChange={this.handleChange}></textarea>
							</div>
							<div></div>
						</fieldset>
						<div id="recaptcha">
							<Recaptcha sitekey="6LcLs7IUAAAAANJD7BGAJmQ8R_sLQg_Dox8NyNA-" render="explicit" verifyCallback={this.verifyCallback} />
							<br />
						</div>

						<button type="submit" disabled={!!this.state.isVerified ? false : true} className="button">
							Send
						</button>
					</div>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	userInfo: state.user,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
