import React from 'react';
import '../Messages.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import { get, toNumber } from 'lodash';
import date from 'date-and-time';

class Messages extends React.Component {
	componentDidMount() {
		this.props.setPageTitle('Messages');
		if (localStorage.token) {
			axios({
				method: 'get',
				url: `${this.props.API}/messages/my_messages`,
				headers: {
					Authorization: `Bearer ${localStorage.token}`,
				},
			}).then((response) => {
				// if(response.data.length > 0) {
				this.props.newMessages({
					type: 'NEW_MESSAGES',
					messageCount: get(response, 'data', 0).filter((count) => !count.seen).length, //get(response, "data", 0).length,
					messages: get(response, 'data', []),
				});
				// }
			});
		}
	}

	// <Link to={{pathname: `/profile`, profile: { uid: friend._id }}}>
	displayMessages = () => {
		if (toNumber(this.props.messageCount) < 0) {
			return <div>No new messages</div>;
		} else {
			return get(this, 'props.messages', []).map((msg) => (
				<div key={msg._id}>
					{/* <Link to={`/message-display/${get(msg, '_id', '')}/`}><div className='message-list' */}
					<Link to={{ pathname: '/message-display', messageId: msg._id }}>
						<div className="message-list">
							<div className="message-list-subject">Subject: </div>
							<div className="message-list-link">{msg.subject}</div>
							<div className="message-list-date">{date.format(new Date(msg.created), 'dddd MMMM DD h:mmA')}</div>
						</div>
					</Link>
				</div>
			));
		}
	};
	render() {
		return (
			<React.Fragment>
				<this.displayMessages />
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	messageCount: state.messages.messageCount,
	messages: state.messages.messages,
	API: state.config.server.serverAPI,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
