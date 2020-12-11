import React from 'react';
import '../Messages.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import { get, toNumber } from 'lodash';
import dayjs from 'dayjs';
import socket from '../../../../_services/SocketService';

class GetMail extends React.Component {
	componentDidMount() {
		this.props.setPageTitle('Mail');
		// if (!!this.props.userInfo.socketId) {
		// 	socket.emit('mail', {
		// 		eventType: 'checkMail',
		// 		uid: this.props.userInfo.uid,
		// 		authToken: localStorage.token,
		// 		socketID: socket.id, //this.props.userInfo.socketId,
		// 	});
		// }
		if (typeof socket.id === 'string') {
			socket.emit('mail', {
				eventType: 'checkMail',
				uid: this.props.userInfo.uid,
				authToken: localStorage.token,
				socketID: socket.id,
			});
		}
	}

	displayMail = () => {
		if (toNumber(this.props.messageCount) < 0) {
			return <div>No mail</div>;
		} else {
			return get(this, 'props.inbox', []).map((mail) => (
				<tr style={!!mail.seen ? { backgroundColor: 'lightgray' } : { fontWeight: 'bold' }}>
					<td>
						<Link to={{ pathname: '/read_mail', mailID: mail._id }}>{dayjs(mail.created).format('MM/DD/YYYY')}</Link>
					</td>
					<td>
						<Link to={{ pathname: '/read_mail', mailID: mail._id }}>{mail.subject}</Link>
					</td>
					<td>
						<Link to={{ pathname: '/read_mail', mailID: mail._id }}>{get(mail, 'from.username', 'No User Found')}</Link>
					</td>
				</tr>
			));
		}
	};

	render() {
		return (
			<div>
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Subject</th>
							<th>From</th>
						</tr>
					</thead>
					<tbody>
						<this.displayMail />
					</tbody>
				</table>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	mailCount: state.userMail.mailCount,
	inbox: state.userMail.inbox,
	sentItems: state.userMail.sentItems,
	userInfo: state.user,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GetMail);