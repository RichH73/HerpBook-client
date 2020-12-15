import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import 'react-tabs/style/react-tabs.css';
import _ from 'lodash';
import './DisplayAnimal/Collections.css';
import dayjs from 'dayjs';
import ScanQr from '../../_services/Scan/ScanBarCode';
import { sub } from 'date-fns';

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
		const newId = this.props.collections.filter((collection) => {
			return collection._id === id;
		});
		this.props.newBarCode('');
		this.props.currentAnimalDisplay(_.first(newId));
		this.props.history.push('/view_animal');
	};

	categoryList = (id) => {
		//const selectCategories = this.props.categories.filter((category) => category.id === id);
		const collections = this.props.collections.map((collection) => {
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

	sortLists = () => {
		const { subCategory, collections } = this.props;
		let combine = [];
		let collection_sub = collections.map((collection) => {
			return collection.sub_category;
		});
		//TODO review this. It's throwing a warning without eslint-disable
		// eslint-disable-next-line
		subCategory.filter((sub) => {
			if (_.includes(collection_sub, sub.id)) {
				combine.push({
					header: sub.name,
					subs: collections.filter((col) => {
						return col.sub_category === sub.id;
					}),
				});
			}
		});
		return combine.map((display) => (
			//const dob = dayjs(_.get(sub, "dob"));
			<div>
				<h4>{display.header}</h4>
				<table>
					<thead>
						<th>ID</th>
						<th>Name</th>
						<th>DOB</th>
						<th>Gender</th>
					</thead>
					<tbody>
						{display.subs.map((sub) => {
							return (
								<tr onClick={() => this.loadAnimal(sub._id)}>
									<td>{sub._id}</td>
									<td>{sub.name}</td>
									{!!_.get(sub, 'dob') ? <td>{dayjs(sub.dob).format('MM/DD/YYYY')}</td> : <td></td>}
									<td>{sub.gender}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		));
	};

	showLists = () => {
		const collectionFilter = !!this.state.sub_cat
			? this.props.collections.filter((animal) => {
					if (animal.sub_category === this.state.sub_cat) {
						return animal;
					}
			  })
			: this.props.collections;
		return (
			<div>
				<table>
					<thead>
						<th>ID</th>
						<th>Name</th>
						<th>DOB</th>
						<th>Gender</th>
					</thead>
					<tbody>
						{collectionFilter.map((sub) => {
							return (
								<tr onClick={() => this.loadAnimal(sub._id)}>
									<td>{sub._id}</td>
									<td>{sub.name}</td>
									{!!_.get(sub, 'dob') ? <td>{dayjs(sub.dob).format('MM/DD/YYYY')}</td> : <td></td>}
									<td>{sub.gender}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	};

	subDropdown = () => {
		let changeFilter = (event) => {
			this.setState({
				[event.target.name]: _.toNumber(event.target.value),
			});
		};
		let subsFiltered = _.uniq(
			this.props.collections.map((sub) => {
				return sub.sub_category;
			})
		);
		return (
			<select name="sub_cat" onChange={changeFilter}>
				<option>Show all</option>
				{subsFiltered.map((sub) => (
					<option value={sub}>{sub}</option>
				))}
			</select>
		);
	};

	render() {
		const { codeSearched } = this.props;
		if (!!codeSearched) {
			this.loadAnimal(codeSearched);
		}
		return (
			<React.Fragment>
				<div className="collections-my-collections">
					<div className="collections-qr-search">
						<img src="/images/scan_100.png" alt="scan" onClick={this.showHideScanner} />
						{!!this.state.showScanner ? <ScanQr /> : ''}
					</div>
					<div>{this.subDropdown()}</div>
					<div className="collections-my-collections-active-list">{this.showLists()}</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	userInfo: state.user,
	currentAnimal: state.viewAnimal,
	selectedAnimalId: state.selectedAnimal.id,
	collections: state.wholeCollection.collections,
	category: state.categories.categories,
	subCategory: state.categories.subCategories,
	codeSearched: state.scanBarCode.id,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCollections);
