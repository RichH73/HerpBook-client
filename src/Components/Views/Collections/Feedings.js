import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import date from 'date-and-time';

class Feedings extends Component {
	state = {};

	componentDidMount() {}

	handleScan(data) {
		this.setState({
			result: data,
		});
	}

	handleError(err) {
		console.error(err);
	}

	feedingRecords = () => {
		const records = this.props.feedingRecords.map((record) => {
			return (
				<div className="collections-animal-records-feedings">
					<table>
						<tbody>
							<th>Date</th>
							<th>Type</th>
							<th>Feeder Type</th>
							<tr onClick={() => console.log(record)}>
								<td>{record.date}</td>
								<td>{record.feederType}</td>
								<td>{record.feederWeight}</td>
							</tr>
						</tbody>
					</table>
				</div>
			);
		});
		return records;
	};

	render() {
		return <React.Fragment>{this.feedingRecords()}</React.Fragment>;
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	userInfo: state.user,
	React: state.config.analytics,
	feedingRecords: state.viewAnimal.feedings,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedings);
