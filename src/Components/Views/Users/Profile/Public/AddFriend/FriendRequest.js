import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
import { FaFacebookSquare, FaTwitter, FaYoutube, FaEnvelope, FaUserFriends } from 'react-icons/fa';
import { Link } from 'react-router-dom';
// import socket from '../../../../_services/SocketService';
import ReactQuill from 'react-quill';
import axios from 'axios';
import CryptoJS from 'crypto-js';
//import { Decrypt } from '../../../../../_services/encryptionService';

import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

class FriendRequest extends Component {
	state = {};

	showContactModal = () => {};

	componentDidMount() {}

	componentDidUpdate(prevProps) {}

	sendRequest = () => {};

	render() {
		console.log(!!this.props.userInfo.my_friends.includes(this.props.User.uid));
		return (
			<div className="my-profile-main-profile-grid-fb">
				<div>
					<FaUserFriends className="my-profile-main-profile-grid-message-icon" />
				</div>
				{this.props.userInfo.my_friends.includes(this.props.User.uid) ? <div>Friend</div> : <div className="web-link">Add Friend</div>}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	userInfo: state.user,
	mods: state.richText,
	User: state.PublicProfile.User,
	API: state.config.server.serverAPI,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendRequest);
