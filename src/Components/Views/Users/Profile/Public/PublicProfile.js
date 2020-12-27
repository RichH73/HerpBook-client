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

class PublicProfile extends Component {
	state = {};
	componentDidMount() {
		socket.emit('viewUserProfile', {
			data: {
				username: this.props.match.params.id,
				type: 'publicView',
			},
		});
		console.log(!!this.props.match.params.id);
	}

	render() {
		const id = this.props.match.params.id;
		return (
			<React.Fragment>
				Users page with id of: {id}
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
					<div>
						<Link to={`/user/${id}/about`}>About</Link>
					</div>
					<div>
						<Link to={`/user/${id}/activity`}>Activity</Link>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicProfile);
