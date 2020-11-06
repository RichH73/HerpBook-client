import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';

import BarcodeReader from 'react-barcode-reader';

class Settings extends Component {
	state = {};

	componentDidMount() {}

	render() {
		return (
			<React.Fragment>
				<Tabs>
					<TabList>
						<Tab>Feeders</Tab>
						<Tab>Supplies</Tab>
					</TabList>
					<div className="collections-tab-body">
						<TabPanel></TabPanel>
					</div>
				</Tabs>
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
