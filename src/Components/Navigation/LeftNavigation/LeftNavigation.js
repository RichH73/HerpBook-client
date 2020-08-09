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
						<div>
							<Link to="/my_profile">My Profile</Link>
						</div>
						<div>
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
						<div>
							<Link to="/my_classifieds">My Classifieds</Link>
						</div>

						<div>
							<Link to="/create_classified">Create Classified</Link>
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
						<div>
							<Link to="/">Home</Link>
						</div>
						<div>
							<Link to="/vendors">Breeders / Vendors</Link>
						</div>
						<div>
							<Link to="/classifieds">Classifieds</Link>
						</div>
						<div>
							<Link to="/contact">Contact Us</Link>
						</div>
						<div>
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
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);
