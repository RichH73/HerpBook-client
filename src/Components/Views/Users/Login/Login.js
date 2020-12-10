import React from 'react';
import './Login.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Base64 } from 'js-base64';
import socket from '../../../_services/SocketService';
import { startSocketService } from '../../../_services/SocketService';
import _ from 'lodash';
/*
facebook login stuff

import FacebookLogin from 'react-facebook-login';

        <Link to="/register">register here.</Link>
          <FacebookLogin
          appId="891710347959626"
          autoLoad={true}
          fields="name,email,picture"
          onClick={this.componentClicked}
          callback={this.responseFacebook} />

*/

class Login extends React.Component {
	state = {
		username: '',
		email: '',
		password: '',
		password_length_check: false,
		password_string: '(password is too short)',
		login_failed: false,
	};

	componentDidMount() {
		this.props.setPageTitle('Login');
	}

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
					//startSocketService()
					const user = JSON.parse(Base64.decode(response.data.token.split('.')[1]));
					localStorage.setItem('token', get(response, 'data.token'));
					this.props.user_login(user);
					this.props.history.push({
						pathname: '/',
					});
				}
			})
			.catch((error) => {
				this.setState({
					login_failed: true,
				});
				console.log(error);
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

	componentClicked = () => {};

	responseFacebook = (response) => {};
	render() {
		return (
			<div className="register-form">
				<form onSubmit={this.submitHandler} autoComplete="off">
					<div className="form-group">
						<fieldset className="form-group">
							<legend className="border-bottom form_space">Login</legend>

							<div className="form-control-sm">
								<label id="username" className="col-form-label  requiredField">
									Username<span className="asteriskField">*</span>
								</label>

								<input
									type="username"
									name="username"
									className="form-control"
									required
									id="id_username"
									placeholder="Username"
									onChange={this.onChangeHandler}
									autoComplete="off"
								/>
							</div>

							<div className="form-control-sm">
								<label id="id_password" className="col-form-label  requiredField">
									Password<span className="asteriskField">* </span>
									<span>{this.state.password_length_check ? '   (password ok)' : '   (password too short)'}</span>
								</label>

								<input type="password" name="password" className="textinput form-control" required id="id_password" onChange={this.onChangeHandler} />
							</div>
						</fieldset>
						<button type="submit" className="button">
							Login
						</button>
						{this.state.login_failed === true ? (
							<div style={{ color: 'red' }}>Login failed. Please check your username and or password and try again.</div>
						) : (
							''
						)}
					</div>
				</form>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
