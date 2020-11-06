import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Collections.css';
import Pairings from './Pairings';
import Feedings from './Feedings';
import Animal from './Animal';

import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';

class MyCollections extends Component {
	state = {};

	componentDidMount() {}

	render() {
		return (
			<div className="collections-tab-header">
				My Collections
				<Tabs>
					<TabList>
						<Tab>Animal</Tab>
						<Tab>Pairings</Tab>
						<Tab>Feedings</Tab>
					</TabList>
					<div className="collections-tab-body">
						<TabPanel>
							<Animal />
						</TabPanel>
						<TabPanel>
							<Pairings />
						</TabPanel>
						<TabPanel>
							<Feedings />
						</TabPanel>
					</div>
				</Tabs>
			</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyCollections);
