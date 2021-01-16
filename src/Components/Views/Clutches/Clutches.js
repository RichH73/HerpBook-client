import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import './Clutches.css';
import { toNumber, uniq } from 'lodash';
import dayjs from 'dayjs';

import axios from 'axios';
// import ReactGA from 'react-ga';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

class Clutches extends Component {
	state = {
		startDate: '',
	};

	componentDidMount() {
		this.props.getMyClutches();
	}

	componentWillUnmount() {}

	onSubmitHandler = (event) => {
		event.preventDefault();

		axios({
			method: 'post',
			url: `${this.props.API}/collections/new_collection`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {},
		})
			.then((response) => {
				this.props.pageLoading(false);
				if (response.status === 200) {
					this.props.imagesUploaded();
					this.props.currentAnimalDisplay(response.data);
					this.props.pageLoading(false);
					this.props.history.push('/view_animal');
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	handleDate = (date) => {
		this.props.createAnimalData({
			dob: date,
		});
	};

	filterBySire = () => {
		const { clutches } = this.props;
		const options = uniq(
			clutches.map((clutch) => {
				return clutch.sire;
			})
		);
		return uniq(options.map((option) => <option value={option}>{`${option}`}</option>));
	};

	filterByDam = () => {
		const { clutches } = this.props;
		const options = uniq(
			clutches.map((clutch) => {
				return clutch.dam;
			})
		);
		return uniq(options.map((option) => <option value={option}>{`${option}`}</option>));
	};

	collectionsFilter = (event) => {
		this.props.newCollectionsFilter({
			[event.target.name]: event.target.value,
		});
	};

	onClickHandler = (clutch) => {
		this.props.loadClutch(clutch);
		this.props.history.push({
			pathname: `/edit_clutch/${clutch._id}`,
		});
	};

	clutchRecords = () => {
		let { clutches, filters } = this.props;
		if (!!filters.sire) {
			clutches = clutches.filter((clutch) => {
				if (clutch.sire === filters.sire) {
					return clutch;
				}
			});
		}
		if (!!filters.dam) {
			clutches = clutches.filter((clutch) => {
				if (clutch.dam === filters.dam) {
					return clutch;
				}
			});
		}
		if (!!filters.species) {
			clutches = clutches.filter((clutch) => {
				if (clutch.sub_category === toNumber(filters.species)) {
					return clutch;
				}
			});
		}
		return clutches.map((clutch) => (
			<tr onClick={() => this.onClickHandler(clutch)}>
				<td>{dayjs(clutch.layDate).format('MMM DD, YYYY')}</td>
				<td>{clutch.dam}</td>
				<td>{clutch.sire}</td>
			</tr>
		));
	};

	render() {
		let subsFiltered = uniq(
			this.props.clutches.map((sub) => {
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
				<div className="clutches-list-filter">
					<h4>Quick Filters</h4>
					<Form>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Filter by Dam</Form.Label>
								<Form.Control as="select" name="dam" onChange={this.collectionsFilter} value={this.props.filters.dam}>
									<option value="">All</option>
									{this.filterByDam()}
								</Form.Control>
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label>Filter by Sire</Form.Label>
								<Form.Control as="select" name="sire" onChange={this.collectionsFilter} value={this.props.filters.sire}>
									<option value="">All</option>
									{this.filterBySire()}
								</Form.Control>
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label size="md">Species</Form.Label>
								<Form.Control name="species" as="select" onChange={this.collectionsFilter} value={this.props.filters.species} size="md">
									<option value="">All</option>
									{subsList.map((sub) => (
										<option key={sub.id} value={sub.id}>
											{sub.name}
										</option>
									))}
								</Form.Control>
							</Form.Group>
						</Form.Row>
					</Form>
				</div>
				<div>
					<Table bordered striped hover size="sm">
						<thead>
							<tr>
								<th>Lay Date</th>
								<th>Dam</th>
								<th>Sire</th>
							</tr>
						</thead>
						<tbody>{this.clutchRecords()}</tbody>
					</Table>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	userInfo: state.user,
	clutches: state.my_clutches.clutchData,
	subCategory: state.categories.subCategories,
	filters: state.my_clutches.filters,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Clutches);

/*
category: Number,
  sub_category: Number,
  notes: String,
  sire: String,
  dam: String,
  layDate: Date,
  eggCount: Number,
  hatchCount: Number,
  images: [images],
  hatchlings: [hatchlings],
  owner: String,
  directory: String,
  URL: String,
  active: Boolean,
  incubationTemp: String
*/
