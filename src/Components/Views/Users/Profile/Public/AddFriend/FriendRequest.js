import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
import { FaUserFriends } from 'react-icons/fa';
// import socket from '../../../../_services/SocketService';
import axios from 'axios';
import { Encrypt } from '../../../../../_services/encryptionService';

class FriendRequest extends Component {
	state = {};

	showContactModal = () => {};

	componentDidMount() {}

	componentDidUpdate(prevProps) {}

	sendRequest = () => {};

	requestFriend = () => {
		console.log('requesting');
		axios({
			url: `${this.props.API}/friends/friend_request`,
			method: 'post',
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				requestFrom: Encrypt(this.props.userInfo),
				requestTo: Encrypt(this.props.userProfile),
			},
		});
	};

	friendStatus = () => {
		const friends = this.props.userInfo.friends.friends.map((friend) => {
			return friend.friendId._id;
		});
		const pending = this.props.userInfo.friends.pending.map((pend) => {
			return pend.friendId._id;
		});
		if (!!friends.includes(this.props.User.uid)) {
			return (
				<div className="my-profile-main-profile-grid-fb">
					<div>
						<FaUserFriends className="my-profile-main-profile-grid-message-icon" />
					</div>
					<div>Friend</div>
				</div>
			);
		}
		if (!!pending.includes(this.props.User.uid)) {
			return (
				<div className="my-profile-main-profile-grid-fb">
					<div>
						<FaUserFriends className="my-profile-main-profile-grid-message-icon" />
					</div>
					<div>Request Pending</div>
				</div>
			);
		}
		if (!friends.includes(this.props.User.uid) && !pending.includes(this.props.User.uid)) {
			return (
				<div className="my-profile-main-profile-grid-fb">
					<div>
						<FaUserFriends className="my-profile-main-profile-grid-message-icon" />
					</div>
					<div className="web-link" onClick={this.requestFriend}>
						Add Friend
					</div>
				</div>
			);
		}
	};

	render() {
		const { userInfo, userProfile } = this.props;
		if (userInfo.username != userProfile.username) {
			return this.friendStatus();
		}
		return <React.Fragment></React.Fragment>;
	}
}

const mapStateToProps = (state) => ({
	userInfo: state.user,
	mods: state.richText,
	User: state.PublicProfile.User,
	API: state.config.server.serverAPI,
	userProfile: state.PublicProfile.User,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendRequest);
