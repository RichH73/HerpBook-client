import React, { Component } from 'react';
import './LeftNavigation.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';

class LeftNav extends Component {
	userNavigation = () => {
		const { displayMessageCount } = this.props;
		return (
			<React.Fragment>
				<div className="left-main-navigation-outter-panel">
					<div className="left-navigation-panel-header">
						<h3>User Navigation</h3>
					</div>
					<div className="left-main-nav">
						<div className="left-nav-link">
							<Link to="/my_profile">My Profile</Link>
						</div>
						<div className="left-nav-link">
							{!!displayMessageCount ? (
								<Link to="/messages">
									My Messages: <small style={{ color: 'red' }}>{displayMessageCount}</small>
								</Link>
							) : (
								<Link to="/messages">My Messages</Link>
							)}
						</div>
					</div>
				</div>
				<div className="left-main-navigation-outter-panel">
					<div className="left-navigation-panel-header">
						<h3>My Classifieds</h3>
					</div>
					<div className="left-main-nav">
						<div className="left-nav-link">
							<Link to="/my_classifieds">My Classifieds</Link>
						</div>

						<div className="left-nav-link">
							<Link to="/create_classified">Create Classified</Link>
						</div>
					</div>
				</div>
				<div className="left-main-navigation-outter-panel">
					<div className="left-navigation-panel-header">
						<h3>My Collections</h3>
					</div>
					<div className="left-main-nav">
						<div className="left-nav-link">
							<div className="left-nav-link">
								<Link to="/my_collections">My Collections</Link>
							</div>
							<div className="left-nav-link">
								<Link to="/new_collection">Add new animal</Link>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	};

	logOut = () => {
		localStorage.removeItem('token');
		this.props.userLogOut();
	};

	render() {
		const { userCheck } = this.props;
		return (
			<React.Fragment>
				<div className="left-main-navigation-outter-panel">
					<div className="left-navigation-panel-header">
						<h3>Navigation</h3>
					</div>
					<div className="left-main-nav">
						<div className="left-nav-link">
							<Link to="/">Home</Link>
						</div>
						<div className="left-nav-link">
							<Link to="/vendors">Breeders / Vendors</Link>
						</div>
						<div className="left-nav-link">
							<Link to="/classifieds">Classifieds</Link>
						</div>
						<div className="left-nav-link">
							<Link to="/shames">Wall of Shame</Link>
						</div>
						<div className="left-nav-link">
							<Link to="/contact">Contact Us</Link>
						</div>
						<div className="left-nav-link">
							{!!userCheck ? (
								<Link to="/" onClick={this.logOut}>
									Logout
								</Link>
							) : (
								<Link to="/login">Login</Link>
							)}
						</div>
					</div>
				</div>
				{!!userCheck ? <this.userNavigation /> : ''}
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
	collectionsIds: state.wholeCollection,
	collectionsData: state.wholeCollection.collections,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);
