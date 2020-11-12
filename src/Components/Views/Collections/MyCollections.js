import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import _ from 'lodash';
import './DisplayAnimal/Collections.css';
import Main from './DisplayAnimal/Main';

import queryString from 'query-string';

class MyCollections extends Component {
	state = {};

	componentDidMount() {
		this.props.getMyCollections({ uid: this.props.userInfo.uid });
		this.props.setPageTitle('Collections');
	}

	componentWillUnmount() {
		this.props.clearCurrentAnimalDisplay();
	}

	loadAnimal = (id) => {
		const newId = this.props.collectionsIds.collections.filter((collection) => {
			return collection._id === id;
		});
		this.props.currentAnimalDisplay(_.first(newId));
		this.props.history.push('/vew_animal');
	};

	categoryList = (id) => {
		const selectCategories = this.props.categories.filter((category) => category.id === id);

		const collections = this.props.collectionsIds.collections.map((collection) => {
			return (
				<tr onClick={() => this.loadAnimal(collection._id)}>
					<td>{collection._id}</td>
					<td>{collection.name}</td>
					<td>{collection.gender}</td>
				</tr>
			);
		});

		return collections;
	};

	render() {
		return (
			<div className="collections-my-collections-list">
				<table>
					<tbody>
						<th>ID</th>
						<th>Name</th>
						<th>Gender</th>
						{this.categoryList()}
					</tbody>
				</table>
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
	currentAnimal: state.viewAnimal,
	selectedAnimalId: state.selectedAnimal.id,
	collectionsIds: state.wholeCollection,
	catIds: state.categories.categories,
	categories: state.categories.categories,
	subCategories: state.categories.sub_categories,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCollections);
