import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions/index';
import Header from './Components/Modules/Header/Header';
import Body from './Components/Modules/Body/Body';
import Spinner from 'react-spinner-material';
import SideDrawer from './Components/Navigation/mobileMenu/sideDrawer';
import Backdrop from './Components/Navigation/mobileMenu/Backdrop/Backdrop';
import { get } from 'lodash';
import axios from 'axios';
import { Base64 } from 'js-base64';
//import Footer from './Components/Modules/Footer/Footer';
import ReactGA from 'react-ga';
import io, { Socket } from 'socket.io-client';

//const socket = io.connect('http://localhost:9000');

const socket = io.connect('http://localhost:9000');
console.log(socket.connected);

socket.emit('news', (data) => {
	console.log('did something', data);
});

ReactGA.initialize('UA-136119302-1');
class App extends Component {
	state = {
		sideDrawerOpen: false,
	};
	componentDidMount() {
		this.props.getVendors();
		if (localStorage.token) {
			this.props.getMyCollections({ uid: this.props.userUID });
			axios({
				method: 'get',
				url: `${this.props.API}/messages/my_messages`,
				headers: {
					Authorization: `Bearer ${localStorage.token}`,
				},
			}).then((response) => {
				// if(response.data.length > 0) {
				this.props.newMessages({
					type: 'NEW_MESSAGES',
					messageCount: get(response, 'data', 0).filter((count) => !count.seen).length, //get(response, "data", 0).length,
					messages: get(response, 'data', []),
				});
				// }
			});
		}
	}

	drawerToggleClickHandler = () => {
		this.setState((prevState) => {
			return { sideDrawerOpen: !prevState.sideDrawerOpen };
		});
	};

	backdropClickHandler = () => {
		this.setState({ sideDrawerOpen: false });
	};

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
				}}
			>
				<div
					style={{
						color: 'white',
						width: '200px',
						height: '200px',
						margin: '20% auto',
					}}
				>
					<div style={{ textAlign: 'center', color: 'black' }}>
						<b>Loading</b>
					</div>
					<div
						style={{
							width: '100px',
							height: '100px',
							margin: '20% auto',
						}}
					>
						<Spinner size={120} stroke={6} color={'orange'} radius={100} spinnerwidth={10} visible={true} />
					</div>
				</div>
			</div>
		);
	};

	render() {
		let backdrop;
		let sideDrawer;

		if (this.state.sideDrawerOpen) {
			backdrop = <Backdrop click={this.backdropClickHandler} />;
			sideDrawer = <SideDrawer history={this.props.history} />;
		}
		if (localStorage.token) {
			let user = JSON.parse(Base64.decode(localStorage.token.split('.')[1]));
			this.props.user_login(user);
		}
		return (
			<React.Fragment>
				<div className="application-body">
					{sideDrawer}
					{backdrop}
					<div id="nav-button" onClick={this.drawerToggleClickHandler}>
						<img src="/images/hamburger_button.png" alt="nav" />
					</div>
					<this.spinner />
					<Header />
					<Body></Body>
					{/* <Footer /> */}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	spinnerState: state.spinner,
	userUID: state.user.uid,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
