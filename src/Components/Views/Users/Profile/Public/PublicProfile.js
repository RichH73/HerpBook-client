import React, { Component } from 'react';
import './PublicProfile.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import { FaFacebookSquare, FaTwitter, FaYoutube, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import socket from '../../../../_services/SocketService';
import ReactQuill from 'react-quill';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Decrypt } from '../../../../_services/encryptionService';

import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

let noUser;

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
		if (!!this.props.match.params.id) {
			axios({
				url: `${this.props.API}/users/profile`,
				method: 'POST',
				headers: {
					Authorization: !!localStorage.token ? `Bearer ${localStorage.token}` : '',
				},
				data: {
					username: this.props.match.params.id,
				},
			})
				.then((response) => {
					if (response.status === 404) {
						this.setState({ noUser: 'holy shit...' });
						this.props.viewUserProfileData({ username: 'no user' });
					}
					if (response.status === 200) {
						this.props.viewUserProfileData(Decrypt(response.data));
					}
				})
				.catch((error) => console.log(error));
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			axios({
				url: `${this.props.API}/users/profile`,
				method: 'POST',
				headers: {
					Authorization: !!localStorage.token ? `Bearer ${localStorage.token}` : '',
				},
				data: {
					username: this.props.match.params.id,
				},
			})
				.then((response) => {
					if (response.status === 404) {
						this.props.viewUserProfileData({ username: 'no user' });
					}
					if (response.status === 200) {
						this.props.viewUserProfileData(Decrypt(response.data));
					}
				})
				.catch((error) => console.log(error));
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
			socketId: socket.id,
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
		if (!User.profile) {
			return (
				<React.Fragment>
					<div className="my-profile-main">
						<Nav className="my-profile-main-nav">
							<Navbar.Brand>
								No User Found
								{/* <Link to={`/user/${id}`}>{`${User.firstName} ${User.lastName}`}</Link> */}
							</Navbar.Brand>
							<Nav.Link>{!!this.props.userInfo.uid ? <Link to={`/user/${id}/friends`}>Friends</Link> : <Link to={`/login`}>Friends</Link>}</Nav.Link>
						</Nav>
					</div>
					<div style={{ padding: '1rem' }}>Oops! Couldn't find profile matching that user :(</div>
				</React.Fragment>
			);
		}

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
						<Nav.Link>{!!this.props.userInfo.uid ? <Link to={`/user/${id}/friends`}>Friends</Link> : <Link to={`/login`}>Friends</Link>}</Nav.Link>
						{/* <Nav.Link>{!!this.props.userInfo.uid ? <Link to={`/user/${id}/friends`}>Friends</Link> : ''}</Nav.Link> */}
						<Nav.Link>{!!this.props.userInfo.uid ? <Link to={`/user/${id}/activity`}>Activity</Link> : ''}</Nav.Link>
					</Nav>
					{/* </Navbar> */}
				</div>
				<Container fluid style={{ marginTop: '1rem' }}>
					<Row sm={2} md={2} lg={2}>
						<Col>
							<Image onClick={this.showContactModal} src={User.profileImage} roundedCircle thumbnail className="my-profile-main-profile-image" />
						</Col>

						<Col>
							<div className="my-profile-main-profile-grid">
								<div className="my-profile-main-profile-grid-message" onClick={this.showContactModal}>
									<div>
										<FaEnvelope className="my-profile-main-profile-grid-message-icon" />
									</div>
									<div>
										<span>
											<Link>Message me</Link>
										</span>
									</div>
								</div>
								<div className="my-profile-main-profile-grid-fb">
									<div>
										<FaFacebookSquare className="my-profile-main-profile-grid-message-icon" />
									</div>
									<div>
										<a href={User.socialMedia.faceBook} target="new">
											FaceBook
										</a>
									</div>
								</div>
								<div className="my-profile-main-profile-grid-fb">
									<div>
										<FaTwitter className="my-profile-main-profile-grid-message-icon" />
									</div>
									<div>
										<a href={User.socialMedia.twitter} target="new">
											Twitter
										</a>
									</div>
								</div>
								<div className="my-profile-main-profile-grid-fb">
									<div>
										<FaYoutube className="my-profile-main-profile-grid-message-icon" />
									</div>
									<div>
										<a href={User.socialMedia.youTube} target="new">
											YouTube
										</a>
									</div>
								</div>
							</div>
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
	API: state.config.server.serverAPI,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicProfile);
