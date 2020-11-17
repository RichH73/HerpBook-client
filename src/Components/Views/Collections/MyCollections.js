import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import 'react-tabs/style/react-tabs.css';
import _ from 'lodash';
import './DisplayAnimal/Collections.css';
import dayjs from 'dayjs';
import ScanQr from '../../_services/Scan/ScanBarCode';

class MyCollections extends Component {
	state = {
		showScanner: false,
	};

	componentDidMount() {
		this.props.getMyCollections();
		this.props.setPageTitle('Collections');
	}

	componentWillUnmount() {}

	showHideScanner = () => {
		if (!!this.state.showScanner) {
			this.setState({
				showScanner: false,
			});
		}
		if (!this.state.showScanner) {
			this.setState({
				showScanner: true,
			});
		}
	};

	loadAnimal = (id) => {
		const newId = this.props.collectionsIds.collections.filter((collection) => {
			return collection._id === id;
		});
		this.props.newBarCode('');
		this.props.currentAnimalDisplay(_.first(newId));
		this.props.history.push('/view_animal');
	};

	categoryList = (id) => {
		//const selectCategories = this.props.categories.filter((category) => category.id === id);
		const collections = this.props.collectionsIds.collections.map((collection) => {
			const dob = dayjs(_.get(collection, 'dob'));
			return (
				<tr onClick={() => this.loadAnimal(collection._id)}>
					<td>{collection._id}</td>
					<td>{collection.name}</td>
					{!!_.get(collection, 'dob') ? <td>{`${dob.$M}/${dob.$D}/${dob.$y}`}</td> : <td></td>}
					<td>{collection.gender}</td>
				</tr>
			);
		});

		return collections;
	};

	render() {
		if (!!this.props.codeSearched) {
			this.loadAnimal(this.props.codeSearched);
		}
		return (
			<div className="collections-my-collections">
				<img src="/images/scan_100.png" alt="scan" onClick={this.showHideScanner} />
				<div className="collections-bar-code-search">{!!this.state.showScanner ? <ScanQr /> : ''}</div>
				<div className="collections-my-collections-active-list">
					<table>
						<tbody>
							<th>ID</th>
							<th>Name</th>
							<th>DOB</th>
							<th>Gender</th>
							{this.categoryList()}
						</tbody>
					</table>
				</div>
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
	codeSearched: state.scanBarCode.id,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCollections);
