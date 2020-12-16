import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import _ from 'lodash';
import dayjs from 'dayjs';
import MDatePicker from 'react-mobile-datepicker';
import './Pairing.css';

class Pairings extends Component {
	state = {
		date: new Date(),
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
				<div className="collections-parings-new-paring-form">
					<div className="collections-parings-new-paring-form-para">
						<p>
							Add a new pairing record by filling in the boxes below then click the "Save" button. Or you can see more information or edit records
							shown below by clicking on the record you want to edit.
						</p>
					</div>
					<div className="collections-pairings-new-pairing">
						<div>
							<label className="field-input-label">Date:</label>
							<div className="collections-pairings-new-pairing-date-desktop-selector">
								<DatePicker showPopperArrow={false} selected={this.state.date} onChange={(date) => this.handleDate(date)} />
							</div>
							<div className="collections-feedings-new-feeding-date-mobile-selector">
								<input type="text" readOnly={true} value={`${pd.$M + 1}/${pd.$D}/${pd.$y}`} onClick={this.mobileHandleClick} />
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
							<label className="field-input-label">Mate:</label>
							<div>
								<input type="text" name="mate" onChange={this.onChangeHandler} />
							</div>
						</div>
						<div>
							<label className="field-input-label">Whitnessed:</label>
							<div>
								<select name="whitnessed" onChange={this.onChangeHandler}>
									<option></option>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
							</div>
						</div>
					</div>
					<div className="collections-pairings-list-button">
						<button className="button" onClick={this.onSubmitHandler} disabled={!this.state.mate}>
							Save
						</button>
					</div>
				</div>
				<div className="collections-animal-records-pairings">
					<div className="collections-pairing-table">
						<table>
							<thead>
								<th>Date</th>
								<th>Mate</th>
								<th>Whitnessed</th>
							</thead>
							<tbody>{this.pairMappings()}</tbody>
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

export default connect(mapStateToProps, mapDispatchToProps)(Pairings);
