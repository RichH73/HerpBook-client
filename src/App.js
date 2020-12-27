import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions/index';
import Header from './Components/Modules/Header/Header';
import Body from './Components/Modules/Body/Body';
import Spinner from 'react-spinner-material';
import { Base64 } from 'js-base64';
import Footer from './Components/Modules/Footer/Footer';
import ReactGA from 'react-ga';
import socket from './Components/_services/SocketService';
// import { SocketService } from './Components/_services/SocketService'

ReactGA.initialize('UA-136119302-1');
class App extends Component {
	state = {
		sideDrawerOpen: false,
		user: this.props.userInfo,
		userSocket: false,
	};
	componentDidMount() {
		socket.on('socketSet', (socket) => {
			this.setState({
				userSocket: true,
			});
		});
		if (localStorage.token) {
			let user = JSON.parse(Base64.decode(localStorage.token.split('.')[1]));
			this.props.user_login(user);
			socket.on('connect', () => {
				socket.emit('newUser', {
					uid: this.props.userInfo.uid,
				});
				this.props.setSocketID(socket.id);
				socket.emit('mail', {
					eventType: 'checkMail',
					uid: this.props.userInfo.uid,
					authToken: localStorage.token,
					socketID: this.props.userInfo.socketId,
				});
			});
		}
		socket.on('alertMessage', (message) => {
			alert(message);
		});
		socket.emit('alertRecieved', 'OK');
		socket.onAny((event, ...args) => {});
		this.props.getVendors();

		socket.on('newMail', (mail) => {
			this.props.newUserMail({
				mailCount: mail.inbox.filter((count) => !count.seen).length,
				inbox: mail.inbox,
				sentItmes: mail.sentItems,
			});
		});
	}

	componentDidUpdate() {
		let socketID = this.props.userInfo.socketId;
		let newSocket = socket.id;
		let userID = this.props.userInfo.uid;
		socket.on('socketSet', (socketID) => {
			console.log('new socket set ', socketID);
		});
		if (!!userID) {
			if (!this.state.userSocket) {
				console.log('No socket?', socketID);
				console.log('this state socket', !!this.state.userSocket);
				socket.emit('setSocketID', {
					uid: userID,
					socketID: newSocket,
				});
			}
			const mySocketID = socket.id;
		}
		if (socketID) {
			socket.emit('mail', {
				eventType: 'checkMail',
				uid: this.props.userInfo.uid,
				authToken: localStorage.token,
				socketID: this.props.userInfo.socketID,
			});
		}
		socket.on('disconnect', () => {
			socket.emit('removeSocketID', {
				uid: this.props.userInfo.uid,
			});
		});
	}

	spinner = () => {
		const { spinnerState } = this.props;
		return (
			<div
				style={{
					display: spinnerState.display,
					width: '100vw',
					height: '100vh',
					zIndex: '300',
					position: 'fixed',
					background: 'rgba(0, 0, 0, 0.2)',
				}}>
				<div
					style={{
						color: 'white',
						width: '200px',
						height: '200px',
						margin: '20% auto',
					}}>
					<div style={{ textAlign: 'center', color: 'black' }}>
						<b>Loading</b>
					</div>
					<div
						style={{
							width: '100px',
							height: '100px',
							margin: '20% auto',
						}}>
						<Spinner size={120} stroke={6} color={'orange'} radius={100} spinnerwidth={10} visible={true} />
					</div>
				</div>
			</div>
		);
	};

	onClickHandler = () => {
		this.props.openSideDrawer();
	};

	render() {
		return (
			<React.Fragment>
				<div className="application-body">
					<this.spinner />
					<Header />
					<Body />
					<Footer />
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	spinnerState: state.spinner,
	userUid: state.user.uid,
	userInfo: state.user,
	sideDrawerOpen: state.navDrawer.sideDrawerOpen,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
