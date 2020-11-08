import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';

import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';

import BarcodeReader from 'react-barcode-reader';

class Activity extends Component {
	state = {
		data: 'Not Found',
	};

	componentDidMount() {}

	handleScan(data) {
		this.setState({
			result: data,
		});
	}

	handleError(err) {
		console.error(err);
	}

	render() {
		return <div style={{ padding: '10px' }}>Some activity?</div>;
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	userInfo: state.user,
	React: state.config.analytics,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
