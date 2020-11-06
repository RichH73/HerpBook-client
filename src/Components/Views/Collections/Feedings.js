import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';

import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';

import BarcodeReader from 'react-barcode-reader';

class Feedings extends Component {
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
		return (
			<React.Fragment>
				<BarcodeReader onError={this.handleError} onScan={this.handleScan} />
				<p>{this.state.result}</p>
			</React.Fragment>
		);
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

export default connect(mapStateToProps, mapDispatchToProps)(Feedings);
