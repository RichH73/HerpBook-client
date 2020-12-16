import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import MDatePicker from 'react-mobile-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import _ from 'lodash';
import dayjs from 'dayjs';
import './Sheddings.css';
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
			date: date,
		});
	};

	editingRecord = (shedRecord) => {
		this.props.loadrecordsEditor({
			recordType: 'sheddings',
			display: 'block',
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
		const fd = dayjs(_.get(this, 'state.time'));
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
						<div>
							<label className="field-input-label">Date:</label>
							<div className="collections-sheddings-new-shedding-date-desktop-selector">
								<DatePicker showPopperArrow={false} selected={this.state.date} onChange={(date) => this.handleDate(date)} />
							</div>
							<div className="collections-sheddings-new-shedding-date-mobile-selector">
								<input type="text" readOnly={true} value={`${fd.$M + 1}/${fd.$D}/${fd.$y}`} onClick={this.mobileHandleClick} />
								<MDatePicker
									dateConfig={dateConfig}
									value={this.state.time}
									isOpen={this.state.isOpen}
									confirmText="Select"
									cancelText="Cancel"
									onSelect={this.mobileHandleSelect}
									onCancel={this.mobileHandleCancel}
									theme="ios"
								/>
							</div>
						</div>
						<div>
							<label className="field-input-label">Complete Shed:</label>
							<div className="collections-sheddings-new-shedding-full-shed-selector">
								<select name="fullShed" onChange={this.onChangeHandler}>
									<option></option>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
							</div>
						</div>
					</div>
					<div className="collections-sheddings-list-button">
						<button
							className="button"
							disabled={this.state.readOnly}
							onClick={this.onSubmitHandler}
							// eslint-disable-next-line
							disabled={!this.state.fullShed.length}
							label="Save"
						>
							Save
						</button>
					</div>
				</div>
				<div className="collections-animal-sheddings-records">
					<div className="collections-shedding-table">
						<table>
							<thead>
								<th>Date</th>
								<th>Complete Shed</th>
							</thead>
							<tbody>{this.shedMappings()}</tbody>
						</table>
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
