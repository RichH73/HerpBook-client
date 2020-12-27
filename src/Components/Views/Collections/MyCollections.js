import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import 'react-tabs/style/react-tabs.css';
import { get, first, toNumber, uniq } from 'lodash';
import './DisplayAnimal/Collections.css';
import './MyCollections.css';
import dayjs from 'dayjs';
import ScanQr from '../../_services/Scan/ScanBarCode';

//Bootstrap imports
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

class MyCollections extends Component {
	state = {
		showScanner: false,
	};

	componentDidMount() {
		this.props.getMyCollections();
		this.props.setPageTitle('Collections');
	}

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
		this.props.currentAnimalDisplay(first(newId));
		this.props.history.push('/view_animal');
	};

	showLists = () => {
		let { filters, collections } = this.props;
		if (!!filters.sub_cat) {
			collections = collections.filter((collection) => {
				if (collection.sub_category === toNumber(filters.sub_cat)) {
					return collection;
				}
			});
		}
		if (!!filters.gender) {
			collections = collections.filter((collection) => {
				if (collection.gender === filters.gender) {
					return collection;
				}
			});
		}
		return collections.map((sub) => (
			<div className="my-collections-collection-container" onClick={() => this.loadAnimal(sub._id)} key={sub._id}>
				<div className="my-collections-collection-container-image">
					<img src={`${sub.images[0].URL}/${sub.images[0].thumbnail}`} />
				</div>
				<div className="my-collections-collection-container-table">
					<Table bordered size="sm">
						<thead>
							<tr>
								{sub.userCreatedID ? <th>Animal ID</th> : <th>ID</th>}
								<th>Name</th>
								<th>DOB</th>
								<th>Gender</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								{sub.userCreatedID ? <td>{sub.userCreatedID}</td> : <td>{window.innerWidth < 700 ? sub._id.substr(0, 6) : sub._id}</td>}
								<td>{sub.name}</td>
								{!!get(sub, 'dob') ? <td>{dayjs(sub.dob).format('MM/DD/YYYY')}</td> : <td></td>}
								<td>{sub.gender}</td>
							</tr>
						</tbody>
					</Table>
				</div>
			</div>
		));
	};

	clearFilters = () => {
		this.props.clearCollectionFilters();
	};

	selectFilters = () => {
		let changeFilter = (event) => {
			this.props.newCollectionFilter([event.target.name], event.target.value);
		};
		let subsFiltered = uniq(
			this.props.collections.map((sub) => {
				return sub.sub_category;
			})
		);
		const subsList = this.props.subCategory.filter((newSub) => {
			if (subsFiltered.includes(newSub.id)) {
				return newSub;
			}
		});
		return (
			<React.Fragment>
				<div className="my-collections-quick-filters">
					<h4>Quick Filters</h4>
					<div className="my-collections-quick-filters-select">
						<Form>
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label size="md">Species</Form.Label>
									<Form.Control name="sub_cat" as="select" onChange={changeFilter} value={this.props.filters.sub_cat} size="md">
										<option value="">All</option>
										{subsList.map((sub) => (
											<option key={sub.id} value={sub.id}>
												{sub.name}
											</option>
										))}
									</Form.Control>
								</Form.Group>

								<Form.Group as={Col}>
									<Form.Label>Gender</Form.Label>
									<Form.Control name="gender" as="select" onChange={changeFilter} value={this.props.filters.gender} size="md">
										<option value="">All</option>
										<option value="MALE">Male</option>
										<option value="FEMALE">Female</option>
										<option value="UNKNOWN">Unknown</option>
									</Form.Control>
								</Form.Group>
							</Form.Row>
						</Form>
					</div>
					<div className="my-collections-quick-filters-select-clear" onClick={this.clearFilters}>
						Clear Filters
					</div>
				</div>
			</React.Fragment>
		);
	};

	render() {
		const { codeSearched } = this.props;
		if (!!codeSearched) {
			this.loadAnimal(codeSearched);
		}
		return (
			<React.Fragment>
				<div className="my-collections-collections">
					<div className="my-collections-qr-search">
						<img src="/images/scan_100.png" alt="scan" onClick={this.showHideScanner} />
						{!!this.state.showScanner ? <ScanQr history={this.props.history} /> : ''}
					</div>
					<div>{this.selectFilters()}</div>
					<div className="my-collections-collections-active-list">{this.showLists()}</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	category: state.categories.categories,
	codeSearched: state.scanBarCode.id,
	collections: state.myCollections.collections,
	currentAnimal: state.viewAnimal,
	filters: state.myCollectionsFilters,
	selectedAnimalId: state.selectedAnimal.id,
	subCategory: state.categories.subCategories,
	URL: state.config.server.serverURL,
	userInfo: state.user,
	USERSURL: state.config.server.usersURL,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCollections);
