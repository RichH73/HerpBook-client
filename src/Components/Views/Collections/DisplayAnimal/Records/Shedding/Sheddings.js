import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import _ from 'lodash';
import dayjs from 'dayjs';
import './Sheddings.css';

// Bootstrap imports
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

class Sheddings extends Component {
	state = {
		date: new Date(),
		isOpen: false,
		readOnly: true,
		fullShed: '',
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
		return <div className="collections-sheddings-records-detail-view">some record</div>;
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
			url: `${this.props.API}/collections/new_shedding`,
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

	editingRecord = (shedRecord) => {
		this.props.loadrecordsEditor({
			recordType: 'sheddings',
			editModal: true,
			//display: 'block',
			...shedRecord,
		});
	};

	shedMappings = () => {
		return this.props.currentAnimal.sheddings.map((shed) => {
			return (
				<tr className="collections-shedding-table-tr" onClick={() => this.editingRecord(shed)}>
					<td>{dayjs(_.get(shed, 'date')).format('MM/DD/YYYY')}</td>
					{!!shed.fullShed ? <td>Yes</td> : <td>No</td>}
				</tr>
			);
		});
	};

	render() {
		return (
			<div className="collections-sheddings-list" style={{ padding: '10px' }}>
				<div className="collections-sheddings-new-shedding-form">
					<div className="collections-sheddings-new-shedding-form-para">
						<p>
							Add a new shedding record by filling in the boxes below then click the "Save" button. Or you can see more information or edit records
							shown below by clicking on the record you want to edit.
						</p>
					</div>
					<div className="collections-sheddings-new-shedding">
						<Form>
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>Date</Form.Label>
									<Form.Control type="date" name="date" onChange={this.handleDate} size="md" />
								</Form.Group>

								<Form.Group as={Col}>
									<Form.Label>Complete Shed</Form.Label>
									<Form.Control as="select" name="fullShed" onChange={this.onChangeHandler} size="md">
										<option></option>
										<option value={true}>Yes</option>
										<option value={false}>No</option>
									</Form.Control>
								</Form.Group>
							</Form.Row>
							<Button
								disabled={this.state.readOnly}
								onClick={this.onSubmitHandler}
								disabled={!this.state.fullShed.length}
								variant="success"
								size="md"
								block>
								Save
							</Button>
						</Form>
					</div>
				</div>
				<div className="collections-animal-sheddings-records">
					<div className="collections-shedding-table">
						<Table striped bordered hover size="md">
							<thead>
								<th>Date</th>
								<th>Complete Shed</th>
							</thead>
							<tbody>{this.shedMappings()}</tbody>
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

export default connect(mapStateToProps, mapDispatchToProps)(Sheddings);
