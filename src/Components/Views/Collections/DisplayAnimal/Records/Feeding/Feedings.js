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
import './Feeding.css';
class Feedings extends Component {
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

	editingRecord = (feedRecord) => {
		this.props.loadrecordsEditor({
			recordType: 'feeding',
			display: 'block',
			...feedRecord,
		});
	};

	feedMappings = () => {
		return this.props.currentAnimal.feedings.map((feed) => {
			let fd = dayjs(_.get(feed, 'date'));
			return (
				<tr className="collections-feeding-table-tr" onClick={() => this.editingRecord(feed)}>
					<td>{`${fd.$M + 1}/${fd.$D}/${fd.$y}`}</td>
					<td>{feed.feederType}</td>
					<td>{feed.feederWeight}</td>
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
			<div className="collections-feedings-list" style={{ padding: '10px' }}>
				<div className="collections-feedings-new-feeding-form">
					<div className="collections-feedings-new-feeding-form-para">
						<p>
							Add a new feed record by filling in the boxes below then click the "Save" button. Or you can see more information or edit records shown
							below by clicking on the record you want to edit.
						</p>
					</div>
					<div className="collections-feedings-new-feeding">
						<div>
							<label>Date:</label>
							<div className="collections-feedings-new-feeding-date-desktop-selector">
								<DatePicker showPopperArrow={false} selected={this.state.date} onChange={(date) => this.handleDate(date)} />
							</div>
							<div className="collections-feedings-new-feeding-date-mobile-selector">
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
							<label>Feeder Type:</label>
							<div>
								<input type="text" name="feederType" onChange={this.onChangeHandler} />
							</div>
						</div>
						<div>
							<label>Amout or weight:</label>
							<div>
								<input type="text" name="feederWeight" onChange={this.onChangeHandler} />
							</div>
						</div>
					</div>
					<div className="collections-feedings-list-button">
						<button className="button" onClick={this.onSubmitHandler}>
							Save
						</button>
					</div>
				</div>
				<div className="collections-animal-feedings-records">
					<div className="collections-feeding-table">
						<table>
							<tbody>
								<th>Date</th>
								<th>Feeder Type</th>
								<th>Amount or weight</th>
								{this.feedMappings()}
							</tbody>
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

export default connect(mapStateToProps, mapDispatchToProps)(Feedings);
