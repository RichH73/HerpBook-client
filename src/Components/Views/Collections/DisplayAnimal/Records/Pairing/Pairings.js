import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import _ from 'lodash';
import dayjs from 'dayjs';
import './Pairing.css';

// Bootstrap imports
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

class Pairings extends Component {
	state = {
		date: Date(),
		isOpen: false,
	};

	componentDidMount() {}

	mobileHandleClick = () => {
		this.setState({ isOpen: true });
	};

	mobileHandleCancel = () => {
		this.setState({ isOpen: false });
	};

	mobileHandleSelect = (time) => {
		this.setState({ time, isOpen: false });
	};
	RecordDetail = () => {
		return <div className="collections-pairings-records-detail-view">some record</div>;
	};

	onChangeHandler = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};
	sayState = () => {
		console.log('I have spoken', this.state.date);
	};
	onSubmitHandler = (event) => {
		event.preventDefault();
		this.props.pageLoading(true);
		setTimeout(() => {
			this.props.pageLoading(false);
		}, 10000);
		axios({
			method: 'post',
			url: `${this.props.API}/collections/new_pairing`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				//date: _.get(this.state, 'date', new Date()),
				...this.state,
				collectionId: this.props.currentAnimal._id,
			},
		})
			.then((response) => {
				if (response.status === 201) {
					this.props.pageLoading(false);
					this.props.currentAnimalDisplay(response.data[0]);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	handleDate = (date) => {
		this.setState({
			date: dayjs(date.target.value).toString(),
		});
	};

	editingRecord = (pairRecord) => {
		this.props.loadrecordsEditor({
			recordType: 'pairings',
			display: 'block',
			...pairRecord,
		});
	};

	pairMappings = () => {
		return this.props.currentAnimal.pairings.map((pair) => {
			let pd = dayjs(_.get(pair, 'date'));
			return (
				<tr className="collections-feeding-table-tr" onClick={() => this.editingRecord(pair)}>
					<td>{`${pd.$M + 1}/${pd.$D}/${pd.$y}`}</td>
					<td>{pair.mate}</td>
					<td>{!!pair.whitnessed ? 'Yes' : 'No'}</td>
				</tr>
			);
		});
	};

	displayMate = () => {
		const { category, sub_category, _id, gender } = this.props.currentAnimal;
		let collections = this.props.collections;
		if (!sub_category) {
			collections = [];
		}
		if (!!sub_category) {
			collections = collections.filter((sub) => {
				if (sub.sub_category === _.toNumber(sub_category) && sub.gender !== gender && sub._id !== _id && sub.collectionType === 'BREEDER') {
					return sub;
				}
			});
			return collections.map((collection) => <option value={collection._id}>{`${collection._id} / ${collection.name}`}</option>);
		}
	};

	render() {
		const monthMap = {
			'1': 'Jan',
			'2': 'Feb',
			'3': 'Mar',
			'4': 'Apr',
			'5': 'May',
			'6': 'Jun',
			'7': 'Jul',
			'8': 'Aug',
			'9': 'Sep',
			'10': 'Oct',
			'11': 'Nov',
			'12': 'Dec',
		};

		const dateConfig = {
			month: {
				format: (value) => monthMap[value.getMonth() + 1],
				caption: 'Mon',
				step: 1,
			},
			date: {
				format: 'DD',
				caption: 'Day',
				step: 1,
			},
			year: {
				format: 'YYYY',
				caption: 'Year',
				step: 1,
			},
		};
		const pd = dayjs(_.get(this, 'state.time'));

		return (
			<div className="collections-pairings-list" style={{ padding: '10px' }}>
				<div className="collections-parings-new-paring-form-para">
					<p>
						Add a new pairing record by filling in the boxes below then click the "Save" button. Or you can see more information or edit records shown
						below by clicking on the record you want to edit.
					</p>
				</div>
				<div className="collections-parings-new-paring-form">
					<Form>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Date</Form.Label>
								<Form.Control type="date" name="date" onChange={this.handleDate} size="md" />
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label>Mate</Form.Label>
								<Form.Control as="select" name="mate" onChange={this.onChangeHandler} size="md">
									<option>Select Mate</option>
									{this.displayMate()}
								</Form.Control>
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label>Whitnessed</Form.Label>
								<Form.Control as="select" name="whitnessed" onChange={this.onChangeHandler} size="md">
									<option></option>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</Form.Control>
							</Form.Group>
						</Form.Row>
						<Button disabled={!this.state.mate} onClick={this.onSubmitHandler} variant="success" size="md" block>
							Save
						</Button>
					</Form>
				</div>
				<div className="collections-animal-records-pairings">
					<div className="collections-pairing-table">
						<Table bordered striped hover size="sm">
							<thead>
								<th>Date</th>
								<th>Mate</th>
								<th>Whitnessed</th>
							</thead>
							<tbody>{this.pairMappings()}</tbody>
						</Table>
					</div>
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
	collections: state.myCollections.collections,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Pairings);
