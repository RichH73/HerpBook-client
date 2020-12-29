import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
//import Dropzone from 'react-dropzone';
import { get, forEach, first, flatten } from 'lodash';
import ReactQuill from 'react-quill';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';

// Bootstrap imports
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Toast from 'react-bootstrap/Toast';
import socket from '../../_services/SocketService';

class Search extends React.Component {
	state = {};

	componentDidMount() {
		console.log(socket.id);
		console.log(this.props);
		socket.on('searchResults', (data) => {
			console.log('return data', data);
		});
	}

	componentDidUpdate(pevProps) {
		if (pevProps.location.search !== this.props.location.search) {
			console.log('it changed, ', this.props.location.search.split('?')[1]);
			socket.emit('siteSearch', {
				searchText: this.props.location.search.split('?')[1],
				socket: socket.id,
			});
		}
	}

	render() {
		return <React.Fragment></React.Fragment>;
	}
}

const mapStateToProps = (state) => {
	return {
		states: state.states,
		userInfo: state.user,
		mods: state.richText,
		USERSURL: state.config.server.usersURL,
		API: state.config.server.serverAPI,
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
