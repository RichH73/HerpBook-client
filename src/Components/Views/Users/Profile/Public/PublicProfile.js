import React, { Component } from 'react';
import './PublicProfile.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import About from './About/About';
import Images from './Images/Images';
import { Route, useParams, Link } from 'react-router-dom';
import socket from '../../../../_services/SocketService';

import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';

class PublicProfile extends Component {
	state = {
		User: {},
		contactModal: false,
		subject: '',
		messageBody: '',
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
		socket.emit('viewUserProfile', {
			username: this.props.match.params.id,
			type: 'publicView',
			sock: socket.id,
		});

		socket.on('displayUserData', (data) => {
			console.log('this is the user', data);
			this.setState({
				User: data,
			});
			console.log('this state: ', this.state);
		});
	}

	onChangeHandler = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
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
				recipient: user._id,
				from: this.props.userInfo.uid,
			},
			newMailMessage: {
				from: this.props.userInfo.uid,
				sent: new Date(),
				subject: this.state.subject,
				body: this.props.text,
			},
		});
		this.setState({ contactModal: false });
	};

	contactModalForm = () => {
		return (
			<Modal show={this.state.contactModal} onHide={this.hideContactModal} backdrop="static" keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>Modal title</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Row>
							<Form.Label>Subject</Form.Label>
							<Form.Control type="text" name="subject" onChange={this.onChangeHandler} />
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
		return (
			<React.Fragment>
				Users page with id of: {id}
				<br />
				The User:
				<p>{this.state.User._id}</p>
				<div>
					<Navbar
						style={{ backgroundColor: 'orange', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}
						variant="light"
						collapseOnSelect
						expand="sm">
						<Navbar.Brand>{id}</Navbar.Brand>
						<Nav className="mr-auto">
							<Nav.Link>
								<Link to={`/user/${id}/about`}>About</Link>
							</Nav.Link>
							<Nav.Link>
								<Link to={`/user/${id}/activity`}>Activity</Link>
							</Nav.Link>
						</Nav>
						<Form inline>
							<Form.Control type="text" placeholder="Search" className="mr-sm-2" />
							<Button variant="outline-info">Search</Button>
						</Form>
					</Navbar>
				</div>
				<p onClick={this.showContactModal}>Contact me</p>
				{this.contactModalForm()}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	userInfo: state.user,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicProfile);
