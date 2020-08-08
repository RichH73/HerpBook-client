import React from 'react';
import '../Messages.css';
import { connect } from 'react-redux';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import { first, filter } from 'lodash';
import date from 'date-and-time';
import ReactHtmlParser from 'react-html-parser';
import _ from 'lodash';

class MessageDisplay extends React.Component {
	messageReply = (message) => {
		this.props.messageReply(message);
		this.props.history.push('/message-reply');
	};

	componentDidMount() {
		const { messages } = this.props;
		const { messageId } = this.props.location;
		const message = first(filter(messages, { _id: messageId }));
		this.props.setPageTitle(_.get(message, 'subject', 'No Message'));
	}

	deleteMessage = (id) => {
		axios({
			method: 'post',
			url: `${this.props.API}/messages/delete_message`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
				uid: localStorage.uid,
			},
			data: {
				message_id: id,
			},
		})
			.then((response) => {
				if (response.status === 200) {
					this.props.history.push({
						pathname: '/messages',
					});
				}
			})
			.catch((error) => [console.log(error)]);
	};

	messageSeen = (message) => {
		this.props.messageSeen(message._id);
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
				<div className="message-display-footer">
					<div className="message-display-from">From: {message.fromusername}</div>
					<div className="message-display-sent">Sent: {date.format(new Date(message.created), 'dddd MMMM DD h:mmA')}</div>
				</div>
				<div className="message-display-body">{ReactHtmlParser(message.message)}</div>
				<div className="display-message-buttons">
					<button type="button" className="btn btn-success display-message-button" onClick={() => this.messageReply(message)}>
						Reply
					</button>
					<button onClick={() => this.deleteMessage(message._id)} className="btn btn-danger display-message-button">
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
	//messageData: state.messages.messageData
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(MessageDisplay);
