import React from 'react';
import './SideDrawer.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
//import Backdrop from '../mobileMenu/Backdrop/Backdrop'

class SideDrawer extends React.Component {
	userNavigation = () => {
		const { displayMessageCount } = this.props;
		return (
			<React.Fragment>
				<div className="sideDrawer-left-main-navigation-outter-panel">
					<div className="sideDrawer-left-navigation-panel-header">
						<h3>User Navigation</h3>
					</div>
					<div className="sideDrawer-left-main-nav">
						<div className="sideDrawer-nav-link">
							<a href="/my_profile">My Profile</a>
						</div>
						<div className="sideDrawer-nav-link">
							{!!displayMessageCount ? (
								<a href="/messages">
									My Messages: <small style={{ color: 'red' }}>{displayMessageCount}</small>
								</a>
							) : (
								<a href="/messages">My Messages</a>
							)}
						</div>
					</div>
				</div>
				<div className="sideDrawer-left-main-navigation-outter-panel">
					<div className="sideDrawer-left-navigation-panel-header">
						<h3>My Classifieds</h3>
					</div>
					<div className="sideDrawer-left-main-nav">
						<div className="sideDrawer-nav-link">
							<a href="/my_classifieds">My Classifieds</a>
						</div>

						<div className="sideDrawer-nav-link">
							<a href="/create_classified">Create Classified</a>
						</div>
					</div>
				</div>
				<div className="sideDrawer-left-main-navigation-outter-panel">
					<div className="sideDrawer-left-navigation-panel-header">
						<h3>My Collections</h3>
					</div>
					<div className="sideDrawer-left-main-nav">
						<div className="sideDrawer-nav-link">
							<a href="/my_collections">My Collections</a>
						</div>
						<div className="sideDrawer-nav-link">
							<a href="/new_collection">Add new animal</a>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	};

	logOut = () => {
		localStorage.removeItem('token');
		this.props.userLogOut();
		//this.props.history.push('/')
	};

	render() {
		return (
			<React.Fragment>
				<div className="sideDrawer-left-main-navigation-outter-panel">
					<div className="sideDrawer-left-navigation-panel-header">
						<h3>Site Navigation</h3>
					</div>
					<div className="sideDrawer-left-main-nav">
						<div className="sideDrawer-nav-link">
							<a href="/">Home</a>
						</div>
						<div className="sideDrawer-nav-link">
							<a href="/vendors">Breeders / Vendors List</a>
						</div>
						<div className="sideDrawer-nav-link">
							<a href="/classifieds">Classifieds</a>
						</div>
						<div className="sideDrawer-nav-link">
							<a href="/shames">Wall of Shame</a>
						</div>
						<div className="sideDrawer-nav-link">
							<a href="/contact">Contact Us</a>
						</div>
						<div className="sideDrawer-nav-link">
							<div>
								{!!this.props.userCheck ? (
									<a href="/logout" onClick={this.logOut}>
										<u>Logout</u>
									</a>
								) : (
									<a href="/login">Login</a>
								)}
							</div>
						</div>
					</div>
				</div>
				{!!this.props.userUid ? <this.userNavigation /> : ''}
			</React.Fragment>
		);
	}
}
const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	userCheck: state.user.uid,
	displayMessageCount: state.messages.messageCount,
	userUid: state.user.uid,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);
