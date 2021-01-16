import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
// eslint-disable-next-line
import Recaptcha from 'react-recaptcha';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import _ from 'lodash';

//Bootstrap imports
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

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
		validated: false,
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

	FormExample() {
		const [validated, setValidated] = useState(false);

		const handleSubmit = (event) => {
			const form = event.currentTarget;
			if (form.checkValidity() === false) {
				event.preventDefault();
				event.stopPropagation();
			}

			setValidated(true);
		};

		return (
			<Form noValidate validated={validated} onSubmit={handleSubmit}>
				....
			</Form>
		);
	}

	submitHandler = (event) => {
		event.preventDefault();
		const { password, confirm_password } = this.state;
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			this.setState({
				validated: true,
			});
		}
		if (password !== confirm_password) {
			this.setState({
				validated: true,
			});
		}
		if (this.state.isVerified) {
			axios({
				method: 'post',
				url: `${this.props.API}/login/signup`,
				responseType: 'json',
				data: {
					username: _.trim(this.state.username).replace(/ /g, ''),
					entityEmail: _.trim(this.state.entityEmail).replace(/ /g, ''),
					firstName: _.trim(this.state.firstName).replace(/ /g, ''),
					lastName: _.trim(this.state.lastName).replace(/ /g, ''),
					password: _.trim(this.state.password).replace(/ /g, ''),
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
		const { validated, password, confirm_password, matched } = this.state;
		return (
			<div className="register-form">
				<Form autocomplete="off" noValidate validated={validated} onSubmit={this.submitHandler}>
					<Form.Row>
						<Form.Group as={Col} controlId="formGridEmail">
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								name="username"
								placeholder="Enter username"
								onChange={this.onChangeHandler}
								required
								size="md"
								value={this.state.username}
								minLength="8"
							/>
							<Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
							<Form.Control.Feedback type="invalid">Username must must not contain spaces.</Form.Control.Feedback>
						</Form.Group>

						<Form.Group as={Col} controlId="formGridPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control minLength="8" type="password" name="password" placeholder="Password" onChange={this.onChangeHandler} required size="md" />
							<Form.Control.Feedback type="invalid">Please enter at least 8 charecters</Form.Control.Feedback>
							<Form.Control.Feedback type="valid">Looks good</Form.Control.Feedback>
						</Form.Group>
					</Form.Row>
					<Form.Row>
						<Form.Group as={Col} xs={8} controlId="formGridEmail">
							<Form.Label>Email Address</Form.Label>
							<InputGroup size="md">
								<InputGroup.Prepend>
									<InputGroup.Text>@</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control type="email" name="entityEmail" placeholder="Enter Email" onChange={this.onChangeHandler} required size="md" />
								<Form.Control.Feedback type="valid">Looks Good!</Form.Control.Feedback>
								<Form.Control.Feedback type="invalid">Please provide a valid Email Address.</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>

						{/* <Form.Group as={Col} controlId="formGridPassword">
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control
								type="password"
								name="confirm_password"
								placeholder="ConfirmPassword"
								onChange={this.onChangeHandler}
								required
								size="md"
								minLength='8'
								isInvalid={password === confirm_password ? false : true}
							/>
							<Form.Control.Feedback type="invalid">Passwords do not match.</Form.Control.Feedback>
							<Form.Control.Feedback type={password === confirm_password ? 'valid' : ''}>Passwords match.</Form.Control.Feedback>
						</Form.Group> */}
					</Form.Row>

					<Form.Row>
						<Form.Group as={Col}>
							<Form.Label>First Name</Form.Label>
							<Form.Control type="text" name="firstName" placeholder="First Name" onChange={this.onChangeHandler} reqired size="md" required />
							<Form.Control.Feedback type="invalid">Please enter your first name.</Form.Control.Feedback>
							<Form.Control.Feedback type="valid">Looks good.</Form.Control.Feedback>
						</Form.Group>

						<Form.Group as={Col}>
							<Form.Label>Last Name</Form.Label>
							<Form.Control type="text" name="lastName" placeholder="Last Name" onChange={this.onChangeHandler} required size="md" required />
							<Form.Control.Feedback type="invalid">Please enter your last name.</Form.Control.Feedback>
							<Form.Control.Feedback type="valid">Looks good</Form.Control.Feedback>
						</Form.Group>
					</Form.Row>

					<Button variant="primary" type="submit" size="md">
						Submit
					</Button>
				</Form>
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
