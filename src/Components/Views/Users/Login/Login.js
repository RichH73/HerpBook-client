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
import _ from 'lodash';

// import FacebookLogin from "react-facebook-login";
/*
facebook login stuff

import FacebookLogin from 'react-facebook-login';

        <div>
			<p>Or you can sing in with your Facebook Account.</p>
			<div>
				<FacebookLogin
				appId="891710347959626"
				autoLoad={true}
				fields="name,email,picture"
				onClick={this.componentClicked}
				callback={this.responseFacebook} />
			</div>
		</div>

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
				}
			})
			.then(() => {
				socket.emit('setSocketID', {
					uid: this.props.userInfo.uid,
					socketID: socket.id,
				});
			})
			.then(() => {
				socket.emit('mail', {
					eventType: 'checkMail',
					uid: this.props.userInfo.uid,
					authToken: localStorage.token,
					socketID: this.props.userInfo.socketId,
				});
				this.props.history.push({
					pathname: '/',
				});
			})
			.catch((error) => {
				this.setState({
					login_failed: true,
				});
				throw new Error('An error has occured', error);
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

	componentClicked = (event) => {
		console.log('this is facebook event', _.cloneDeep(event));
	};

	responseFacebook = (response) => {
		console.log('this is facebook response', response);
	};

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

/*
TODO create code to make this functional

*reponse*
accessToken: "EAAMrAX6IXUoBAHczs7YWMGfpPUncsmRDPPeHltQ8E2IFXfz9rRy5xhxoYo81I8DHcQTL1sGsEfxV107Yi8LgFNVVr9xMRujGBDjyDkglfaFSRe52qqJIys5H37TBp8SLMVXTjEc7RqUHPKE5k8fvIEevEEifevOSZCRcH4xYF18hBHYZAvAjPr3VISGXXaj0w7ADDkUAZDZD"
data_access_expiration_time: 1615378925
email: "richh73@gmail.com"
expiresIn: 5875
graphDomain: "facebook"
id: "3588944124455500"
name: "Richard Howell"
picture:
data:
height: 50
is_silhouette: false
url: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3588944124455500&height=50&width=50&ext=1610194925&hash=AeQ4Ns4oFnGGnpyqQ00"
width: 50
__proto__: Object
__proto__: Object
signedRequest: "o4FQG2tPvmheqBPUZvK5W1zZN6Mi_4a3XgdXOD9UoWY.eyJ1c2VyX2lkIjoiMzU4ODk0NDEyNDQ1NTUwMCIsImNvZGUiOiJBUUR4Vk16SGxFbkg5aXVHNG9MeHp0TS1iMjhqVkhac1pRQjBtSWFZQmcxMldReWNheXJvMzlaeXZiWmhSNGhPSzFlcXExcW44NjRWcVhGd0k1Ykl4Y0VzRjhVUFpPQ1ktMWs2enQ2Z0o1SmZMa241c2dpWTRNLUFqeDNJdDRDempGUmRHWFV3cXpZNnY2VHhrakNzVy1TOTI5alA1Tnh2Um1RMFBxR2thQWlfYzhwS20yalo2V2txLXRUeURGcXNnMnNabkhYZWVmVVZRbk5jMXdSSHoxX1ZNbFMwcXZxU3EtRDE0cHgwR2tic3J4bUhWRjc3V1B6TEFLZmhPSGhHMkhUS1VwMGtsQnpUVFEzWlppbXROa3VaazZYamxqRV80TEdWRDZpQldQYkxaWUlJRjNOd1IxY0JXMERvMjNmU21sVHFYWDZ1c1pEcGlpNjI3VnVJckZ0a3dNTXBxWnU1SksxNmJybHBWbWRDVGdiLWtmOWM1cGxIamFoRGotR3ZTY0UiLCJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTYwNzYwMjkyNX0"
userID: "3588944124455500"
__proto__: Object


*event*

altKey: false
bubbles: true
button: 0
buttons: 0
cancelable: true
clientX: 398
clientY: 535
ctrlKey: false
currentTarget: button.kep-login-facebook.metro
defaultPrevented: false
detail: 1
dispatchConfig: {phasedRegistrationNames: {…}, dependencies: Array(1), eventPriority: 0}
eventPhase: 3
getModifierState: ƒ modifierStateGetter(keyArg)
isDefaultPrevented: ƒ functionThatReturnsFalse()
isPropagationStopped: ƒ functionThatReturnsFalse()
isTrusted: true
metaKey: false
movementX: 0
movementY: 0
nativeEvent: MouseEvent {isTrusted: true, screenX: 3598, screenY: 670, clientX: 398, clientY: 535, …}
pageX: 398
pageY: 535
relatedTarget: null
screenX: 3598
screenY: 670
shiftKey: false
target: button.kep-login-facebook.metro
timeStamp: 5249.164999928325
type: "click"
view: Window {window: Window, self: Window, document: document, name: "", location: Location, …}
_dispatchInstances: FiberNode {tag: 5, key: null, elementType: "button", type: "button", stateNode: button.kep-login-facebook.metro, …}
_dispatchListeners: ƒ (e)
_targetInst: FiberNode {tag: 5, key: null, elementType: "button", type: "button", stateNode: button.kep-login-facebook.metro, …}
__proto__: Class

*/
