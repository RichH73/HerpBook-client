import React from 'react';
import './Register.css';
import axios from 'axios';
// eslint-disable-next-line
import Recaptcha from 'react-recaptcha';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';

class Register extends React.Component {
	state = {
		username: '',
		entityEmail: '',
		firstName: '',
		lastName: '',
		password: '',
		confirm_password: '',
		passwords_match: '**Confirm Password must match password',
		matched: false,
		password_length_check: false,
		password_string: '(password must be at least 8 charecters)',
		isVerified: true,
	};

	componentDidMount() {
		this.props.setPageTitle('Register');
	}

	userSet = (res) => {
		var userToken = res.data.token;
		var user_id = res.data.id;
		this.setState({
			token: userToken,
			id: user_id,
		});
	};
	submitHandler = (event) => {
		event.preventDefault();
		if (this.state.isVerified) {
			// eslint-disable-next-line
			if (this.state.matched === true && this.state.password_length_check === true) {
				axios({
					method: 'post',
					url: `${this.props.API}/login/signup`,
					responseType: 'json',
					data: {
						username: this.state.username,
						entityEmail: this.state.entityEmail,
						firstName: this.state.firstName,
						lastName: this.state.lastName,
						password: this.state.password,
					},
				})
					.then((response) => {
						if (response.status === 201) {
							this.props.history.push('/success/register');
						}
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				alert('Something went wrong! Please check all fields.');
			}
			event.preventDefault();
		} else {
			alert('Please verify you are human.');
		}
	};
	onChangeHandler = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
		if (this.state.password.length >= 7) {
			this.setState({ password_length_check: true });
		} else {
			this.setState({ password_length_check: false });
		}
	};

	confirmPassword = (e) => {
		this.setState({
			// eslint-disable-next-line
			[e.target.name]: e.target.value,
		});
		// eslint-disable-next-line
		if (e.target.value === this.state.password) {
			this.setState({ passwords_match: 'Passwords match', matched: true });
		} else {
			this.setState({ passwords_match: '**Confirm Password must match password', matched: false });
		}
	};

	verifyCallback = (response) => {
		this.setState({
			isVerified: true,
		});
	};

	render() {
		return (
			<div className="register-form">
				<form onSubmit={this.submitHandler}>
					<div className="form-group">
						<fieldset className="form-group">
							<legend className="border-bottom form_space">Account Register</legend>

							<div className="form-control-sm">
								<label id="username" className="col-form-label  requiredField">
									Username<span className="asteriskField">*</span>
								</label>

								<input type="username" name="username" className="form-control" required id="id_username" onChange={this.onChangeHandler} />
							</div>

							<div className="form-control-sm">
								<label id="username" className="col-form-label  requiredField">
									Email Address<span className="asteriskField">*</span>
								</label>

								<input type="email" name="entityEmail" className="form-control" required id="id_email" onChange={this.onChangeHandler} />
							</div>

							<div className="form-control-sm">
								<label id="firstName" className="col-form-label  requiredField">
									First Name<span className="asteriskField">*</span>
								</label>

								<input type="text" name="firstName" className="form-control" required id="first_name" onChange={this.onChangeHandler} />
							</div>

							<div className="form-control-sm">
								<label id="first_name" className="col-form-label  requiredField">
									Last Name<span className="asteriskField">*</span>
								</label>

								<input type="text" name="lastName" className="form-control" required id="last_name" onChange={this.onChangeHandler} />
							</div>

							<div className="form-control-sm">
								<label id="id_password" className="col-form-label  requiredField">
									Password <span>{this.state.password_length_check ? 'password is good' : '(password must be at least 8 charecters)'}</span>
									<span className="asteriskField">*</span>
								</label>

								<input type="password" name="password" className="textinput form-control" required id="id_password" onChange={this.onChangeHandler} />
							</div>

							<div className="form-control-sm">
								<label id="id_confirm_password" className="col-form-label  requiredField">
									Confirm Password<span className="asteriskField">*</span>
								</label>

								<input
									type="password"
									name="confirm_password"
									className="textinput form-control"
									required
									id="id_confirm_password"
									onChange={this.confirmPassword}
								/>
								<span>{this.state.passwords_match}</span>
							</div>
						</fieldset>
						<button type="submit">Send</button>
						<div id="recaptcha">
							{/* <Recaptcha sitekey="6LcLs7IUAAAAANJD7BGAJmQ8R_sLQg_Dox8NyNA-" render="explicit" verifyCallback={this.verifyCallback} /> */}
							<br />
						</div>
					</div>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
