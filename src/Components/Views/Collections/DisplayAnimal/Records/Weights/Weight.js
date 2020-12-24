import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import MDatePicker from 'react-mobile-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import dayjs from 'dayjs';
import './Weight.css';

// Bootstrap imports
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

class Weight extends Component {
	state = {
		date: new Date(),
		isOpen: false,
		readOnly: true,
		weight: '',
		weightUnit: 'gm',
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
			url: `${this.props.API}/collections/new_weight`,
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

	editingRecord = (weightRecord) => {
		this.props.loadrecordsEditor({
			recordType: 'weights',
			//display: 'block',
			editModal: true,
			...weightRecord,
		});
		this.setState({ editModal: false });
	};

	weightMappings = () => {
		return this.props.currentAnimal.weights.map((weight) => {
			return (
				<tr className="collections-shedding-table-tr" onClick={() => this.editingRecord(weight)}>
					<td>{dayjs(_.get(weight, 'date')).format('MM/DD/YYYY')}</td>
					<td>{weight.weight}</td>
					<td>{weight.weightUnit}</td>
				</tr>
			);
		});
	};

	render() {
		return (
			<div className="collections-weights-list" style={{ padding: '10px' }}>
				<div className="collections-weights-new-weight-form">
					<div className="collections-weights-new-weight-form-para">
						<p>
							Add a new weight record by filling in the boxes below then click the "Save" button. Or you can see more information or edit records
							shown below by clicking on the record you want to edit.
						</p>
					</div>
					<div className="collections-weight-new-weighing">
						<Form>
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>Date</Form.Label>
									<Form.Control type="date" name="date" onChange={this.handleDate} size="md" />
								</Form.Group>

								<Form.Group as={Col}>
									<Form.Label>Weight</Form.Label>
									<InputGroup>
										{/* <Form.Control as='div'> */}
										<NumberFormat
											thousandSeparator={true}
											className="form-control form-control-md"
											//defaultValue={this.props.recordOverlay.weight}
											allowNegative={false}
											fixedDecimalScale={2}
											onChange={this.onChangeHandler}
											name="weight"
										/>
										{/* </Form.Control> */}
										<Form.Control as="select" name="weightUnit" onChange={this.onChangeHandler} value={this.state.weightUnit} size="md">
											{/* <option value=''>Unit</option> */}
											<option value="gm">Grams</option>
											<option value="kg">Kilograms</option>
											<option value="oz">Ounces</option>
											<option value="lb">Pounds</option>
										</Form.Control>
									</InputGroup>
								</Form.Group>
							</Form.Row>
							<Button
								disabled={this.state.readOnly}
								onClick={this.onSubmitHandler}
								disabled={!this.state.weight.length}
								variant="success"
								size="md"
								block>
								Save
							</Button>
						</Form>
					</div>
				</div>
				<div className="collections-animal-weights-records">
					<div className="collections-weights-table">
						<Table bordered stripped hover size="md">
							<tbody>
								<th>Date</th>
								<th>Weight</th>
								<th>Weight Unit</th>
								{this.weightMappings()}
							</tbody>
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

export default connect(mapStateToProps, mapDispatchToProps)(Weight);
