import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import _ from 'lodash';
import dayjs from 'dayjs';
class Feedings extends Component {
	state = {
		date: '',
	};

	componentDidMount() {}

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
		this.props.recordsEitor({
			_id: feedRecord._id,
			recordType: 'feeding',
			display: 'block',
			record: feedRecord,
		});
	};

	feedMappings = () => {
		return this.props.currentAnimal.feedings.map((feed) => {
			let fd = dayjs(_.get(feed, 'date'));
			return (
				<tr onClick={() => this.editingRecord(feed)}>
					<td>{`${fd.$M + 1}/${fd.$D}/${fd.$y}`}</td>
					<td>{feed.feederType}</td>
					<td>{feed.feederWeight}</td>
				</tr>
			);
		});
	};

	render() {
		return (
			<div className="collections-feedings-list" style={{ padding: '10px' }}>
				<div className="collections-feedings-new-feeding">
					<div>
						<label>Date:</label>
						<div>
							<DatePicker showPopperArrow={false} selected={this.state.date} onChange={(date) => this.handleDate(date)} />
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
				<div className="collections-feeding-page"></div>
				<div className="collections-animal-records-feedings">
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
