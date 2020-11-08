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
import Settings from './Settings';
import Activity from './Activity';
import AddNewAnimal from './AddNewAnimal';

import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';

class MyCollections extends Component {
	state = {};

	componentDidMount() {
		this.props.setPageTitle('Collections');
	}

	tabs = () => {
		return (
			<div className="collections-tab-header">
				<Tabs>
					<TabList>
						<Tab>Animal</Tab>
						<Tab>Pairings</Tab>
						<Tab>Feedings</Tab>
						<Tab>Activity</Tab>
						<Tab>Settings</Tab>
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
						<TabPanel>
							<Activity />
						</TabPanel>
						<TabPanel>
							<Settings />
						</TabPanel>
					</div>
				</Tabs>
			</div>
		);
	};

	render() {
		return !!this.props.selectedAnimalId.length ? this.tabs() : <AddNewAnimal />;
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	userInfo: state.user,
	React: state.config.analytics,
	currentAnimal: state.viewAnimal,
	selectedAnimalId: state.selectedAnimal.id,
	collectionsIds: state.wholeCollection,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCollections);
