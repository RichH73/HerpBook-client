import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
//import './Collections.css';
import Pairings from './Records/Pairing/Pairings';
import Feedings from './Records/Feeding/Feedings';
import Animal from './AnimalView/Animal';
import Photos from './Photos';
import Activity from './Activity/Activity';
import axios from 'axios';

class Main extends Component {
	state = {};

	componentDidMount() {
		if (this.props.location.searchString) {
			axios({
				method: 'post',
				url: `${this.props.API}/collections/search`,
				headers: {
					Authorization: `Bearer ${localStorage.token}`,
				},
				data: {
					id: this.props.location.searchString, //query.parse(this.props.location.search).id,
				},
			})
				.then((response) => {
					if (response.status === 201) {
						this.props.currentAnimalDisplay(response.data[0]);
						//this.props.setPageTitle(`Viewing Collection: ${this.props.currentAnimal._id}`);
						//this.props.history.push('/view_animal')
					}
				})
				.catch((error) => {
					if (error) {
						console.log('An error has occured', error);
					}
				});
		}

		this.props.setPageTitle(`Viewing Collection: ${this.props.currentAnimal._id}`);
	}

	componentWillUnmount() {
		this.props.hideLargeImage();
		this.props.clearCurrentAnimalDisplay();
		this.props.clearRecordsEditor();
	}

	tabs = () => {
		return (
			<div className="collections-tab-header">
				<Tabs>
					<TabList>
						<Tab>Animal</Tab>
						<Tab>Records</Tab>
						<Tab>Activity</Tab>
						<Tab>Photos</Tab>
					</TabList>
					<div className="collections-tab-body">
						<TabPanel>
							<Animal searchString={''} />
						</TabPanel>
						<TabPanel>
							<Tabs>
								<TabList>
									<Tab>Feedings</Tab>
									<Tab>Pairings</Tab>
									<Tab>Sheddings</Tab>
								</TabList>
								<TabPanel>
									<Feedings />
								</TabPanel>
								<TabPanel>
									<Pairings />
								</TabPanel>
								<TabPanel>Shed</TabPanel>
							</Tabs>
						</TabPanel>
						<TabPanel>
							<Activity history={this.props.history} />
						</TabPanel>
						<TabPanel>
							<Photos />
						</TabPanel>
					</div>
				</Tabs>
			</div>
		);
	};

	render() {
		if (!this.props.currentAnimal._id.length) {
			return <div style={{ margin: 'auto', textAlign: 'center' }}>No collection record selected</div>;
		}
		return this.tabs();
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

export default connect(mapStateToProps, mapDispatchToProps)(Main);
