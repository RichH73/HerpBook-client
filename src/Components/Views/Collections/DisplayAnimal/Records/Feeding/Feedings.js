import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import _ from 'lodash';
import dayjs from 'dayjs';
import './Feeding.css';

// Bootstrap imports
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

class Feedings extends Component {
	state = {
		date: new Date(),
		isOpen: false,
		readOnly: true,
		feederType: '',
		feederWeight: '',
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
		return <div className="collections-feedings-records-detail-view">some record</div>;
	};

	onChangeHandler = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	onSubmitHandler = (event) => {
		event.preventDefault();
		this.props.pageLoading(true);
		setTimeout(() => {
			this.props.pageLoading(false);
		}, 10000);
		axios({
			method: 'post',
			url: `${this.props.API}/collections/new_feeding`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				...this.state,
				collectionId: this.props.currentAnimal._id,
			},
		})
			.then((response) => {
				if (response.status === 201) {
					this.props.pageLoading(false);
					this.setState({
						feederType: '',
						feederWeight: '',
					});
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

	editingRecord = (feedRecord) => {
		this.props.loadrecordsEditor({
			recordType: 'feedings',
			editModal: true,
			//display: 'block',
			...feedRecord,
		});
	};

	feedMappings = () => {
		return this.props.currentAnimal.feedings.map((feed) => {
			return (
				<tr className="collections-feeding-table-tr" onClick={() => this.editingRecord(feed)}>
					<td>{dayjs(_.get(feed, 'date')).format('MM/DD/YYYY')}</td>
					<td>{feed.feederType}</td>
					<td>{feed.feederWeight}</td>
				</tr>
			);
		});
	};
	render() {
		return (
			<div className="collections-feedings-list" style={{ padding: '10px' }}>
				<div className="collections-feedings-new-feeding-form">
					<div className="collections-feedings-new-feeding-form-para">
						<p>
							Add a new feed record by filling in the boxes below then click the "Save" button. Or you can see more information or edit records shown
							below by clicking on the record you want to edit.
						</p>
					</div>
					<div className="collections-feedings-new-feeding">
						<Form>
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>Date</Form.Label>
									<Form.Control type="date" name="date" onChange={this.handleDate} size="md" />
								</Form.Group>

								<Form.Group as={Col}>
									<Form.Label>Type of feeder</Form.Label>
									<Form.Control type="text" name="feederType" onChange={this.onChangeHandler} size="md" />
								</Form.Group>

								<Form.Group as={Col}>
									<Form.Label>Amount/wt.</Form.Label>
									<Form.Control type="text" name="feederWeight" onChange={this.onChangeHandler} size="md" />
								</Form.Group>
							</Form.Row>
							<Button
								disabled={this.state.readOnly}
								onClick={this.onSubmitHandler}
								variant="success"
								disabled={!this.state.feederType.length || !this.state.feederWeight.length}
								size="md"
								block>
								Save
							</Button>
						</Form>
					</div>
				</div>
				<div className="collections-animal-feedings-records">
					<div className="collections-feeding-table">
						<Table bordered striped hover size="md">
							<thead>
								<th>Date</th>
								<th>Feeder Type</th>
								<th>Amount or weight</th>
							</thead>
							<tbody>{this.feedMappings()}</tbody>
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
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedings);
