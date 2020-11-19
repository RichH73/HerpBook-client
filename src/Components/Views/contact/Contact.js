import React from 'react';
import './Contact.css';
import axios from 'axios';
import Recaptcha from 'react-recaptcha';
import { connect } from 'react-redux';

class Contact extends React.Component {
	state = {
		email: '',
		subject: '',
		message: '',
		to_admin: 1,
		isVerified: true,
	};

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	submitHandler = (event) => {
		event.preventDefault();
		if (this.state.isVerified) {
			axios({
				method: 'post',
				url: `${this.props.API}/contact`,
				responseType: 'json',
				data: {
					subject: `(Contact Submission) ${this.state.subject}`,
					email: this.state.email,
					message: this.state.message,
				},
			})
				.then(() => {
					// if (res.status === 201) {

					this.props.history.push('/success/sitecontact');
					// } else {
					// alert("Oops! Something went wrong.");
					// }
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
			this.setState({
				isVerified: true,
			});
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
									onChange={this.handleChange}
								></textarea>
							</div>
							<div>
								{/* <br />
                <label className='field-input-label'>Upload an image: </label>
                <input
                  type="file"
                  name="picture_2"
                  accept="image/*"
                  className="btn btn-success"
                  id="id_picture_2"
                  onChange={this.fileChangeHandler}
                /> */}
							</div>
						</fieldset>
						<div id="recaptcha">
							<Recaptcha sitekey="6LcLs7IUAAAAANJD7BGAJmQ8R_sLQg_Dox8NyNA-" render="explicit" verifyCallback={this.verifyCallback} />
							<br />
						</div>

						<button type="submit" className="btn btn-success">
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
});

export default connect(mapStateToProps)(Contact);
