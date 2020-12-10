import React from 'react';
import '../Messages.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import { get, toNumber } from 'lodash';
import dayjs from 'dayjs';
import socket from '../../../../_services/SocketService';
import ReactQuill, { Quill } from 'react-quill';
import ImageCompress from 'quill-image-compress';
import ReactHtmlParser from 'react-html-parser';

Quill.register('modules/imageCompress', ImageCompress);
class Messages extends React.Component {
	state = {
		typing: false,
		myMessages: [],
		otherMessages: [],
		message: '',
		joined: false,
		currentUsers: [],
	};

	quill = new Quill('.editor', {
		// ...
		modules: {
			// ...
			imageCompress: {
				quality: 0.7, // default
				maxWidth: 1000, // default
				maxHeight: 1000, // default
				imageType: 'image/jpeg', // default
				debug: false, // default
			},
		},
	});

	messagesEndRef = React.createRef();

	componentDidMount() {
		this.scrollToBottom();
		// socket.onAny((event, ...args) => {
		// 	console.log(`got ${event}`);
		//   });
		socket.on('incomingMessage', (data) => {
			console.log('new message coming in...', data.body);
			this.setState((prevState) => ({
				otherMessages: [...this.state.otherMessages, data],
			}));
		});
		socket.on('newJoin', (data) => {
			this.setState((prevState) => ({
				otherMessages: [...this.state.otherMessages, data],
			}));
		});
		this.props.setPageTitle('Messages');
		if (localStorage.token) {
			socket.emit('messages', {
				eventType: 'checkMessages',
				uid: this.props.userInfo.uid,
				authToken: localStorage.token,
			});
			socket.on('newMessages', (messageData) => {
				this.props.newMessages({
					messageCount: messageData.filter((count) => !count.seen).length, //get(response, "data", 0).length,
					messages: messageData,
				});
			});
		}
	}
	componentDidUpdate() {
		this.scrollToBottom();
		let username = this.props.userInfo.username;
		if (!this.state.joined) {
			this.setState({
				joined: true,
			});
			socket.emit('joined', username);
		}
	}

	scrollToBottom = () => {
		this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
	};

	messageText = (value) => {
		this.props.editText({
			text: value,
		});
	};

	sendHandler = (event) => {
		event.preventDefault();
		let fullMessage = {
			username: this.props.userInfo.username,
			date: new Date(),
			body: this.props.text,
			socket: socket.id,
		};
		socket.emit('sendMessage', fullMessage);
		this.props.clearRichText();
	};

	onChange = (event) => {
		console.log(event.target.value);
		// this.setState({
		// 	[event.target.name]: event.target.value
		// 	// name: 'Rich',
		// 	// body: event.target.value
		// })
	};

	typing = () => {
		const styles = {
			span: {
				fontSize: '.5em',
				color: 'gray',
			},
			container: {
				margin: '1em 1em auto auto',
				width: '6em',
			},
		};
		socket.on('userTyping', () => {
			console.log('user typing is being emited');
			return (
				<div style={styles.container}>
					<span style={styles.span}>Someone is typing...</span>
				</div>
			);
		});
	};

	IM = () => {
		return (
			<div style={{ padding: '10px' }}>
				<div style={{ height: '200px', border: '1px solid orange', borderRadius: '7px', marginBottom: '1em', maxHeight: '200px', overflow: 'auto' }}>
					{this.typing()}
					{this.state.otherMessages.map((msg) => (
						<div>
							<span style={{ fontSize: '.7em' }}>{`from: ${msg.username === this.props.userInfo.username ? 'You' : msg.username}`}</span>
							<br />
							<span style={{ fontSize: '.7em' }}>{`Sent: ${dayjs(msg.date).format('MMM DD, YYYY')}`}</span>
							{ReactHtmlParser(msg.body)}
						</div>
					))}
					<div ref={this.messagesEndRef} />
				</div>

				<div style={{ display: 'flex' }}>
					<div style={{ width: '100%' }}>
						{/* <input type='text' name='message' onChange={this.onChange} style={{height: '1.7em', width: '98%', border: '.5px solid orange'}} /> */}
						<ReactQuill
							style={{ backgroundColor: 'white', color: 'black', border: '.5px solid orange', borderRadius: '7px' }}
							name="message"
							value={this.props.text}
							onChange={this.messageText}
							modules={this.props.mods.modules}
							formats={this.props.mods.formats}
							readOnly={false}
							theme="snow"
						/>
					</div>
					<div>
						<button className="button" onClick={this.sendHandler}>
							Send
						</button>
					</div>
				</div>
			</div>
		);
	};

	// <Link to={{pathname: `/profile`, profile: { uid: friend._id }}}>
	displayMessages = () => {
		if (toNumber(this.props.messageCount) < 0) {
			return <div>No new messages</div>;
		} else {
			return get(this, 'props.messages', []).map((msg) => (
				<tr style={!!msg.seen ? { backgroundColor: 'lightgray' } : { fontWeight: 'bold' }}>
					<td>
						<Link to={{ pathname: '/message-display', messageId: msg._id }}>{dayjs(msg.created).format('MM/DD/YYYY')}</Link>
					</td>
					<td>
						<Link to={{ pathname: '/message-display', messageId: msg._id }}>{msg.subject}</Link>
					</td>
					<td>
						<Link to={{ pathname: '/message-display', messageId: msg._id }}>{msg.fromusername}</Link>
					</td>
				</tr>
			));
		}
	};

	dmChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	dmSend = (event) => {
		event.preventDefault();
		let msg = {
			to: this.state.usrSocket,
			username: this.props.userInfo.username,
			date: new Date(),
			socket: socket.id,
			body: `${this.props.userInfo.username} sent you a private message: ${this.state.dmbox}`,
		};
		socket.emit('dm', msg);
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
						<this.displayMessages />
					</tbody>
				</table>
				<div>
					<this.IM />
				</div>
				<div>
					<label>socket</label>
					<input type="text" name="usrSocket" onChange={this.dmChange} />
					<br />
					<label>msg</label>
					<input type="text" name="dmbox" onChange={this.dmChange} />
					<br />
					<button className="button" onClick={this.dmSend}>
						DM
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
	username: state.user.username,
	mods: state.richText,
	text: state.richText.text,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);

/*
<div className="message-list">
							<div className="message-list-subject">Subject: </div>
							<div className="message-list-link">{msg.subject}</div>
							<div className="message-list-date">{date.format(new Date(msg.created), 'dddd MMMM DD h:mmA')}</div>
						</div>

*/
