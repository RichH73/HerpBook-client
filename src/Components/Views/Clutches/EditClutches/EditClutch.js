import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import _ from 'lodash';

import axios from 'axios';
// import ReactGA from 'react-ga';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

class EditClutch extends Component {
	state = {
		startDate: '',
	};

	componentDidMount() {}

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

	category_menu = () => {
		const filteredItems = [5, 11];
		if (this.props.categoryItems.length > 0) {
			let filterCategories = this.props.categoryItems.filter((cat) => {
				return !_.includes(filteredItems, cat.id);
			});
			return filterCategories.map((category) => (
				<option key={category.name} value={category.id}>
					{category.name}
				</option>
			));
		}
	};

	sub_category_menu = () => {
		return _.filter(this.props.sub_categoryItems, ['category_id', _.toNumber(this.props.category)]).map((sub) => (
			<option key={sub.name} value={sub.id}>
				{sub.name}
			</option>
		));
	};

	handleScan(data) {
		this.setState({
			result: data,
		});
	}

	handleDate = (date) => {
		this.props.createAnimalData({
			dob: date,
		});
	};

	formChangeHandler = (event) => {
		this.props.createAnimalData({
			[event.target.name]: event.target.value,
		});
	};

	categoryChangeHandler = (event) => {
		this.props.createAnimalData({
			[event.target.name]: _.toNumber(event.target.value),
		});
	};

	handleError(err) {
		console.error(err);
	}

	render() {
		return (
			<React.Fragment>
				<Form></Form>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	userInfo: state.user,
	clutches: state.my_clutches.clutchData,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditClutch);

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
