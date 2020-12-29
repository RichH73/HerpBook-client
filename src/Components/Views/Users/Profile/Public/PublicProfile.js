import React, { Component } from 'react';
import './PublicProfile.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
//import Friends from './Friends/Friends';
import Images from './Images/Images';
import { Route, useParams, Link } from 'react-router-dom';
import socket from '../../../../_services/SocketService';
import ReactQuill from 'react-quill';

import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Table from 'react-bootstrap/Table';

class PublicProfile extends Component {
	state = {
		User: {},
		contactModal: false,
		subject: '',
		messageBody: '',
		firstName: '',
		lastName: '',
	};

	showContactModal = () => {
		this.setState({
			contactModal: true,
		});
	};

	hideContactModal = () => {
		this.setState({
			contactModal: false,
		});
	};

	componentDidMount() {
		console.log('opening...', this.props.match.params.id);
		this.props.setPageTitle(``);

		socket.emit('viewUserProfile', {
			username: this.props.match.params.id,
			type: 'publicView',
			sock: socket.id,
		});

		socket.on('displayUserData', (data) => {
			//console.log('this is the user', data);
			this.props.viewUserProfileData(data);
			this.setState({
				User: data,
			});
			//console.log('this state: ', this.state);
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			socket.emit('viewUserProfile', {
				username: this.props.match.params.id,
				type: 'publicView',
				sock: socket.id,
			});

			socket.on('displayUserData', (data) => {
				console.log('this is the user', data);
				this.props.viewUserProfileData(data);
				this.setState({
					User: data,
				});
			});
		}
	}

	onChangeHandler = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	setMessageBody = (text) => {
		this.setState({
			messageBody: text,
		});
	};

	sendContact = () => {
		const user = this.state.User;
		socket.emit('mail', {
			eventType: 'createMail',
			uid: this.props.userInfo.uid,
			authToken: localStorage.token,
			socketID: socket.id,
			headers: {
				recipient: user.uid,
				from: this.props.userInfo.uid,
			},
			newMailMessage: {
				from: this.props.userInfo.uid,
				sent: new Date(),
				subject: this.state.subject,
				body: this.state.messageBody,
			},
		});
		this.setState({ contactModal: false });
	};

	contactModalForm = () => {
		return (
			<Modal show={this.state.contactModal} onHide={this.hideContactModal} backdrop="static" keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>Messaging {`${this.props.User.firstName} ${this.props.User.lastName}`}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Row>
							<Form.Label>Subject</Form.Label>
							<Form.Control type="text" name="subject" onChange={this.onChangeHandler} />
						</Form.Row>
						<Form.Row>
							<Form.Group>
								<Form.Label>Message</Form.Label>
								<ReactQuill
									style={{ backgroundColor: 'white', color: 'black' }}
									name="messageBody"
									value={this.state.messageBody}
									onChange={this.setMessageBody}
									modules={this.props.mods.modules}
									formats={this.props.mods.formats}
									readOnly={false}
									theme="snow"
								/>
							</Form.Group>
						</Form.Row>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={this.hideContactModal}>
						Cancel
					</Button>
					<Button variant="success" onClick={this.sendContact}>
						Send
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	render() {
		const id = this.props.match.params.id;
		const { User } = this.props;
		return (
			<div className="my-profile-main">
				<div>
					{/* <Navbar
						style={{ backgroundColor: 'orange', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}
						variant="light"
						collapseOnSelect
						expand="sm"> */}
					<Nav className="my-profile-main-nav">
						<Navbar.Brand>
							<Link to={`/user/${id}`}>{`${User.firstName} ${User.lastName}`}</Link>
						</Navbar.Brand>
						<Nav.Link>
							<Link to={`/user/${id}/friends`}>Friends</Link>
						</Nav.Link>
						<Nav.Link>
							<Link to={`/user/${id}/activity`}>Activity</Link>
						</Nav.Link>
					</Nav>
					{/* </Navbar> */}
				</div>
				<Container fluid style={{ marginTop: '1rem' }}>
					<Row>
						<Col xl={'auto'}>
							<Image onClick={this.showContactModal} src={User.profileImage} roundedCircle thumbnail className="my-profile-main-profile-image" />
						</Col>

						<Col xl={'auto'}>
							<Table>
								<tr>
									<td>
										<Image src="/images/envelop.svg" onClick={this.showContactModal} style={{ cursor: 'pointer', maxWidth: '2rem' }} /> Message me
									</td>
								</tr>
							</Table>
						</Col>
					</Row>
					<Row>
						<ReactQuill name="view-shame-incident-description" value={User.about} readOnly={true} theme="bubble" />
					</Row>
				</Container>
				{this.contactModalForm()}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	userInfo: state.user,
	mods: state.richText,
	User: state.PublicProfile.User,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicProfile);
