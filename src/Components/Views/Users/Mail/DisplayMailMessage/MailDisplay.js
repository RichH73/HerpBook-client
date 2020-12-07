import React from 'react';
import '../Messages.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import { first, filter } from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import _ from 'lodash';
import dayjs from 'dayjs';
import socket from '../../../../_services/SocketService';

class MailDisplay extends React.Component {
	messageReply = (message) => {
		this.props.messageReply(message);
		this.props.history.push('/message-reply');
	};

	componentDidMount() {
		const { mail } = this.props;
		const { mailID } = this.props.location;
		const message = first(filter(mail, { _id: mailID }));
		this.messageSeen(message);
		this.props.setPageTitle(_.get(message, 'subject', 'No Message'));
	}

	deleteMessage = (id) => {
		// socket.emit('deleteMessage', {
		socket.emit('messages', {
			eventType: 'deleteMessage',
			authToken: localStorage.token,
			uid: this.props.userInfo.uid,
			message_id: id,
		});
		this.props.history.push('/messages');
	};

	messageSeen = (mail) => {
		if (!!mail) {
			if (!mail.seen) {
				socket.emit('mail', {
					eventType: 'mailSeen',
					authToken: localStorage.token,
					uid: this.props.userInfo.uid,
					args: {
						mailID: mail._id,
					},
				});
			}
		}
	};

	render() {
		if (!this.props.location.mailID) {
			return <div>No message selected.</div>;
		}
		const { mailID } = this.props.location;
		const { mail } = this.props;
		const message = first(filter(mail, { _id: mailID }));
		return (
			<div className="message-display-pane" key={message.id}>
				<table>
					<thead>
						<tr>
							<th>From</th>
							<th>Subject</th>
							<th>Sent</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{message.from.username}</td>
							<td>{message.subject}</td>
							<td>{dayjs(message.created).format('MM/DD/YYYY @h:mm A')}</td>
						</tr>
					</tbody>
				</table>
				<table>
					<thead>
						<tr>
							<th>{message.from.username} wrote:</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{ReactHtmlParser(message.body)}</td>
						</tr>
					</tbody>
				</table>
				<div className="display-message-buttons">
					<button type="button" className="btn btn-success display-message-button button" onClick={() => this.messageReply(message)}>
						Reply
					</button>
					<button onClick={() => this.deleteMessage(message._id)} className="btn btn-danger display-message-button button">
						Delete
					</button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	messageCount: state.messages.messageCount,
	messages: state.messages.messages,
	API: state.config.server.serverAPI,
	userInfo: state.user,
	mail: state.userMail.inbox,
	//messageData: state.messages.messageData
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(MailDisplay);
