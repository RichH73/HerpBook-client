import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Base64 } from 'js-base64';
import socket from '../../../_services/SocketService';

//Bootstrap imports
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

class Login extends React.Component {
	state = {
		username: '',
		email: '',
		password: '',
		password_length_check: false,
		password_string: '(password is too short)',
		login_failed: true,
		showAlert: false,
	};

	componentDidMount() {
		this.props.setPageTitle('Login');
	}

	hideAlert = () => {
		this.setState({
			showAlert: false,
			alertError: '',
		});
	};

	shootIt = (error) => {
		this.setState({
			//login_failed: true,
			showAlert: true,
			alertError: error,
		});
	};

	submitHandler = (event) => {
		event.preventDefault();
		axios({
			method: 'post',
			url: `${this.props.API}/login`,
			data: {
				username: this.state.username,
				password: this.state.password,
			},
		})
			.then((response) => {
				if (response.status === 200) {
					let sock = socket.id;
					//startSocketService()
					const user = JSON.parse(Base64.decode(response.data.token.split('.')[1]));
					localStorage.setItem('token', get(response, 'data.token'));
					this.props.user_login(user);
					socket.emit('setSocketID', {
						uid: user.uid,
						socketID: socket.id,
					});
					socket.emit('mail', {
						eventType: 'checkMail',
						uid: user.uid,
						authToken: localStorage.token,
						socketID: sock,
					});
					this.props.history.push({
						pathname: '/',
					});
				}
			})
			.catch(function (error) {
				if (error.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					//console.log('data', error.response.data);
					alert(error.response.data.error);
					//console.log('status', error.response.status);
					//console.log('headers', error.response.headers);
					//   this.setState({
					// 	//login_failed: true,
					// 	showAlert: true,
					// 	//alertError: error
					// });
				}
			});
	};

	onChangeHandler = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
		if (this.state.password.length >= 7) {
			this.setState({
				password_length_check: true,
				password_string: '*(password ok)',
			});
		} else {
			this.setState({
				password_length_check: false,
			});
		}
	};

	render() {
		return (
			<div className="register-form">
				<Alert show={this.state.showAlert} variant="danger" onClose={() => this.hideAlert()} dismissible>
					<Alert.Heading>Uh oh!</Alert.Heading>
					<p>
						Looks like something went wrong! Usually this error happens when you enter a wrong username and/or password. If you have recently
						registered your account and this is the first time you are logging in, please make sure that you are entering your username and password
						with no spaces.
					</p>
					{!!this.state.alertError ? <p>For what it's worth, the error returned was. {this.state.alertError}</p> : ''}
					<hr />
				</Alert>
				<Form onSubmit={this.submitHandler} autoComplete="off">
					<Form.Row>
						<Form.Group as={Col} controlId="formGridEmail">
							<Form.Label>Username</Form.Label>
							<Form.Control type="text" name="username" placeholder="Enter username" onChange={this.onChangeHandler} size="md" />
						</Form.Group>

						<Form.Group as={Col} controlId="formGridPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" name="password" placeholder="Password" onChange={this.onChangeHandler} size="md" />
						</Form.Group>
					</Form.Row>

					<Button variant="primary" type="submit" size="md">
						Submit
					</Button>
				</Form>
				If you do not have an account you may <Link to="/register">signup here.</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
