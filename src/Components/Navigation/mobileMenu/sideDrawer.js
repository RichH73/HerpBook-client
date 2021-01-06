import React from 'react';
import './SideDrawer.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import { Link } from 'react-router-dom';
//import Backdrop from '../mobileMenu/Backdrop/Backdrop'

class SideDrawer extends React.Component {
	closeDrawerHandler = () => {
		this.props.closeSideDrawer();
	};
	userNavigation = () => {
		const { displayMailCount } = this.props;
		return (
			<React.Fragment>
				<div className="sideDrawer-left-main-navigation-outter-panel">
					<div className="sideDrawer-left-navigation-panel-header">
						<h4>User Navigation</h4>
					</div>
					<div className="sideDrawer-left-main-nav">
						<div className="sideDrawer-nav-link">
							<Link to="/my_profile" onClick={this.closeDrawerHandler}>
								My Profile
							</Link>
						</div>
						<div className="sideDrawer-nav-link">
							{!!displayMailCount ? (
								<Link to="/my_mail" onClick={this.closeDrawerHandler}>
									My Mail: <small style={{ color: 'red' }}>{displayMailCount}</small>
								</Link>
							) : (
								<Link to="/my_mail" onClick={this.closeDrawerHandler}>
									My Mail
								</Link>
							)}
						</div>
					</div>
				</div>
				<div className="sideDrawer-left-main-navigation-outter-panel">
					<div className="sideDrawer-left-navigation-panel-header">
						<h4>My Classifieds</h4>
					</div>
					<div className="sideDrawer-left-main-nav">
						<div className="sideDrawer-nav-link">
							<Link to="/my_classifieds" onClick={this.closeDrawerHandler}>
								My Classifieds
							</Link>
							{/* <a href="/my_classifieds">My Classifieds</a> */}
						</div>

						<div className="sideDrawer-nav-link">
							<Link to="/create_classified" onClick={this.closeDrawerHandler}>
								Create Classified
							</Link>
						</div>
					</div>
				</div>
				<div className="sideDrawer-left-main-navigation-outter-panel">
					<div className="sideDrawer-left-navigation-panel-header">
						<h4>My Collections</h4>
					</div>
					<div className="sideDrawer-left-main-nav">
						<div className="sideDrawer-nav-link">
							<Link to="/my_collections" onClick={this.closeDrawerHandler}>
								My Collections
							</Link>
						</div>
						<div className="sideDrawer-nav-link">
							<Link to="/new_collection" onClick={this.closeDrawerHandler}>
								Add new animal
							</Link>
						</div>
						<div className="sideDrawer-nav-link">
							<Link to="/clutches" onClick={this.closeDrawerHandler}>
								My Clutches
							</Link>
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
						<h4>Site Navigation</h4>
					</div>
					<div className="sideDrawer-left-main-nav">
						<div className="sideDrawer-nav-link">
							{!!localStorage.token ? (
								<Link to="/home" onClick={this.closeDrawerHandler}>
									Home
								</Link>
							) : (
								<Link to="/" onClick={this.closeDrawerHandler}>
									Home
								</Link>
							)}
						</div>
						<div className="sideDrawer-nav-link">
							<Link to="/vendors" onClick={this.closeDrawerHandler}>
								Breeders / Vendors List
							</Link>
						</div>
						<div className="sideDrawer-nav-link">
							<Link to="/classifieds" onClick={this.closeDrawerHandler}>
								Classifieds
							</Link>
						</div>
						<div className="sideDrawer-nav-link">
							<Link to="/shames" onClick={this.closeDrawerHandler}>
								Wall of Shame
							</Link>
						</div>
						<div className="sideDrawer-nav-link">
							<Link to="/contact" onClick={this.closeDrawerHandler}>
								Contact Us
							</Link>
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
	displayMailCount: state.userMail.mailCount,
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
