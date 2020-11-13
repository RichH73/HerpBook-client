import { isThisHour } from 'date-fns';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class Pairings extends Component {
	state = {
		date: '',
	};

	componentDidMount() {}

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
				this.props.pageLoading(false);
				if (response.status === 201) {
					this.props.clearCurrentAnimalDisplay();
					this.props.currentAnimalDisplay(response.data);
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

	pairMappings = () => {
		return this.props.currentAnimal.pairings.map((pair) => {
			return (
				<tr onClick={() => console.log(pair)}>
					<td>{pair.date}</td>
					<td>{pair.mate}</td>
					<td>{!!pair.whitnessed ? 'Yes' : 'No'}</td>
				</tr>
			);
		});
	};

	render() {
		return (
			<div className="collections-pairings-list" style={{ padding: '10px' }}>
				<div className="collections-pairings-new-pairing">
					<div>
						<label>Date:</label>
						<div>
							<DatePicker showPopperArrow={false} selected={this.state.date} onChange={(date) => this.handleDate(date)} />
						</div>
					</div>
					<div>
						<label>Mate:</label>
						<div>
							<input type="text" name="mate" onChange={this.onChangeHandler} />
						</div>
					</div>
					<div>
						<label>Whitnessed:</label>
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
					<button onClick={this.onSubmitHandler}>Save</button>
				</div>
				<div className="collections-pairing-page"></div>
				<div className="collections-animal-records-pairings">
					<div className="collections-pairing-table">
						<table>
							<tbody>
								<th>Date</th>
								<th>Mate</th>
								<th>Whitnessed</th>
								{this.pairMappings()}
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

export default connect(mapStateToProps, mapDispatchToProps)(Pairings);
