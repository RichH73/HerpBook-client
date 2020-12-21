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

class MessageDisplay extends React.Component {
	messageReply = (message) => {
		this.props.messageReply(message);
		this.props.history.push('/message-reply');
	};

	componentDidMount() {
		const { messages } = this.props;
		const { messageId } = this.props.location;
		const message = first(filter(messages, { _id: messageId }));
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

	messageSeen = (message) => {
		if (!!message) {
			if (!message.seen) {
				socket.emit('messages', {
					eventType: 'messageSeen',
					authToken: localStorage.token,
					uid: this.props.userInfo.uid,
					messageId: message._id,
				});
			}
		}
	};

	render() {
		if (!this.props.location.messageId) {
			return <div>No message selected.</div>;
		}
		const { messageId } = this.props.location;
		const { messages } = this.props;
		const message = first(filter(messages, { _id: messageId }));
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
							<td>{message.fromusername}</td>
							<td>{message.subject}</td>
							<td>{dayjs(message.created).format('MM/DD/YYYY @h:mm A')}</td>
						</tr>
					</tbody>
				</table>
				<table>
					<thead>
						<tr>
							<th>{message.fromusername} wrote:</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{ReactHtmlParser(message.message)}</td>
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
	//messageData: state.messages.messageData
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(MessageDisplay);
