import React, { Component } from 'react';
import './LeftNavigation.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import socket from '../../_services/SocketService';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

class LeftNav extends Component {
	state = {
		searchText: '',
	};

	componentDidUpdate(prevProps) {
		if (prevProps.userInfo.friends.requests.length !== this.props.userInfo.friends.requests.length) {
			this.props.getMyProfile(this.props.userInfo.uid);
		}
	}

	friendRequests = () => {
		const requests = this.props.userInfo.friends.requests;
		if (!!requests.length) {
			return (
				<React.Fragment>
					<div>
						New Friend Request{' '}
						<Badge variant="danger" pill>
							{requests.length}
						</Badge>
					</div>
				</React.Fragment>
			);
		}
	};

	userNavigation = () => {
		const { displayMailCount } = this.props;
		return (
			<React.Fragment>
				<div className="left-main-navigation-outter-panel">
					<div className="left-navigation-panel-header">
						<h4>User Navigation</h4>
					</div>
					<div className="left-main-nav">
						<div className="left-nav-link">
							<Link to="/my_profile">My Profile</Link>
						</div>
						<div className="left-nav-link">
							<Link to="/my_mail">
								My Mail{' '}
								{!!displayMailCount ? (
									<Badge variant="danger" pill>
										{displayMailCount}
									</Badge>
								) : (
									''
								)}
							</Link>
							{/* {!!displayMailCount ? (
								<Link to="/my_mail">
									My Mail <small style={{ color: 'red' }}>{displayMailCount}</small>
								</Link>
							) : (
								<Link to="/my_mail">My Mail</Link>
							)} */}
						</div>
						<div className="left-nav-link">{this.friendRequests()}</div>
					</div>
				</div>
				<div className="left-main-navigation-outter-panel">
					<div className="left-navigation-panel-header">
						<h4>My Classifieds</h4>
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
						<h4>My Collections</h4>
					</div>
					<div className="left-main-nav">
						<div className="left-nav-link">
							<div className="left-nav-link">
								<Link to="/my_collections">My Collections</Link>
							</div>
							<div className="left-nav-link">
								<Link to="/new_collection">Add new animal</Link>
							</div>
							<div className="left-nav-link">
								<Link to="/clutches">Clutches</Link>
							</div>
							{/* <div className="left-nav-link">
								<Link to="/new_clutch">Create New Clutch</Link>
							</div> */}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	};

	logOut = () => {
		socket.emit('removeUserSocket', {
			uid: this.props.userInfo.uid,
		});
		localStorage.removeItem('token');
		this.props.userLogOut();
	};

	siteSearch = () => {};

	searchChangeHandler = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	render() {
		const { userCheck } = this.props;
		return (
			<React.Fragment>
				<div className="left-main-navigation-outter-panel">
					<div className="left-navigation-panel-header">
						<h4>Navigation</h4>
					</div>
					<div className="left-main-nav">
						<div className="left-nav-link">{!!localStorage.token ? <Link to="/home">Home</Link> : <Link to="/">Home</Link>}</div>
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
					{/* <InputGroup className="mb-3" size="sm">
						<Form.Control
							placeholder="User"
							name="searchText"
							aria-label="Recipient's username"
							aria-describedby="basic-addon2"
							onChange={this.searchChangeHandler}
						/>
						<InputGroup.Append>
							<Link to={`/search?${this.state.searchText}`}>
								<Button size="sm" variant="outline-warning" onClick={this.searchUser}>
									Search
								</Button>
							</Link>
						</InputGroup.Append>
					</InputGroup> */}
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
	displayMailCount: state.userMail.mailCount,
	collectionsIds: state.myCollections,
	collectionsData: state.myCollections.collections,
	userInfo: state.user,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);
