import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import { get, includes } from 'lodash';
import dayjs from 'dayjs';
import socket from '../../../../_services/SocketService';
import ReactQuill from 'react-quill';
import './GetMail.css';

//Bootstrap Imports
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class GetMail extends React.Component {
	state = {
		viewMail: false,
		replyMail: false,
		mailMessage: {},
		modalType: '',
	};

	componentDidMount() {
		this.props.setPageTitle('Mail');
		if (typeof socket.id === 'string') {
			socket.emit('mail', {
				eventType: 'checkMail',
				uid: this.props.userInfo.uid,
				authToken: localStorage.token,
				socketId: socket.id,
			});
		}
	}

	closeReadModal = () => {
		this.setState({
			modalType: '',
		});
	};
	openReplyModal = () => {
		this.setState({
			modalType: 'reply',
		});
		this.props.editMailMessage('body', `<br><br><br><br>RE: ${this.props.mailData.body}`);
	};

	closeReplyModal = () => {
		this.setState({
			modalType: '',
		});
	};

	clearMailMessage = () => {
		this.props.viewMailMessage({});
	};

	loadMailMessage = (mail) => {
		this.props.viewMailMessage(mail);
		if (!mail.seen) {
			socket.emit('mail', {
				eventType: 'mailSeen',
				authToken: localStorage.token,
				uid: this.props.userInfo.uid,
				socketId: socket.id,
				mailID: mail._id,
				args: {},
			});
		}
		this.setState({
			modalType: 'read',
		});
	};

	deleteMessage = () => {
		socket.emit('mail', {
			eventType: 'deleteMail',
			authToken: localStorage.token,
			uid: this.props.userInfo.uid,
			socketId: socket.id,
			mailID: this.props.mailData._id,
			args: {},
		});
		this.setState({
			modalType: '',
		});
	};

	mailModal = () => {
		let { mailData } = this.props;
		switch (this.state.modalType) {
			case 'read':
				return (
					<Modal show centered onHide={this.closeReadModal} style={{ backgroundColor: 'rgba(104, 102, 99, 0.342)' }} size="lg">
						<Modal.Header closeButton={false} bsPrefix="mail-message-read-header">
							{/* <Modal.Title> */}
							<Form.Row>
								<Form.Label>{`Message From: ${get(mailData, 'from.username', 'No User Found')}`}</Form.Label>
							</Form.Row>
							<Form.Row>
								<Form.Label>{`Subject: ${get(mailData, 'subject', 'No subject')}`}</Form.Label>
							</Form.Row>
							{/* </Modal.Title> */}
						</Modal.Header>
						<Modal.Body>
							<ReactQuill name="body" value={mailData.body} readOnly={true} theme="bubble" />
						</Modal.Body>
						<Modal.Footer bsPrefix="mail-message-read-footer">
							<Button variant="secondary" onClick={this.closeReadModal}>
								Close
							</Button>{' '}
							<Button variant="primary" onClick={this.openReplyModal}>
								Reply
							</Button>{' '}
							<Button variant="danger" onClick={this.deleteMessage}>
								Delete
							</Button>
						</Modal.Footer>
					</Modal>
				);
			case 'reply':
				return (
					<Modal
						show
						centered
						onHide={this.closeReadModal}
						style={{ backgroundColor: 'rgba(104, 102, 99, 0.342)' }}
						size="lg"
						onEntering={this.setReplyBody}>
						<Form>
							<Modal.Header closeButton={false} bsPrefix="mail-message-reply">
								<Modal.Title>
									<Form.Label>Subject</Form.Label>
									<Form.Control type="text" name="subject" defaultValue={mailData.subject} onChange={this.onChangeHandler} />
								</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<ReactQuill
									style={{ backgroundColor: 'white', color: 'black' }}
									value={mailData.body}
									onChange={this.messageBodyHandler}
									modules={this.props.mods.modules}
									formats={this.props.mods.formats}
									readOnly={false}
									theme="snow"
								/>
							</Modal.Body>
							<Modal.Footer>
								<Button variant="success" onClick={this.sendMail}>
									Send
								</Button>
								<Button variant="primary" onClick={this.closeReplyModal}>
									Cancel
								</Button>
							</Modal.Footer>
						</Form>
					</Modal>
				);
			default:
				return;
		}
	};

	onChangeHandler = (event) => {
		this.props.editMailMessage([event.target.name], event.target.value);
	};

	setReplyBody = () => {
		console.log('caught signal');
		this.props.editMailMessage('body', `<br/>bullshit<br/><hr/>${this.props.mailData.body}`);
	};

	messageBodyHandler = (text) => {
		this.props.editMailMessage('body', text);
	};

	sendMail = (event) => {
		event.preventDefault();
		let { mailData } = this.props;
		socket.emit('mail', {
			eventType: 'createMail',
			uid: this.props.userInfo.uid,
			authToken: localStorage.token,
			socketId: socket.id,
			headers: {
				recipient: mailData.from._id,
				from: this.props.userInfo.uid,
			},
			newMailMessage: {
				from: this.props.userInfo.uid,
				sent: new Date(),
				subject: includes(mailData.subject, 'RE:') ? mailData.subject : `RE: ${mailData.subject}`,
				body: mailData.body,
			},
		});
		socket.on('mailStatus', (status) => {
			if (status === 201) this.closeReadModal();
		});
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
						{this.props.inbox.map((mail) => (
							<tr
								onClick={() => this.loadMailMessage(mail)}
								style={!!mail.seen ? { backgroundColor: 'lightgray', cursor: 'pointer' } : { fontWeight: 'bold', cursor: 'pointer' }}
								key={mail._id}>
								<td>{dayjs(mail.created).format('MM/DD/YYYY')}</td>
								<td>{mail.subject}</td>
								<td>{get(mail, 'from.username', 'No User Found')}</td>
							</tr>
						))}
					</tbody>
				</table>
				{!this.props.inbox.length ? <h4>No mail</h4> : ''}
				{this.mailModal()}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	mailCount: state.userMail.mailCount,
	mailData: state.userMail.mailData,
	inbox: state.userMail.inbox,
	text: state.richText.text,
	sentItems: state.userMail.sentItems,
	userInfo: state.user,
	mods: state.richText,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GetMail);
