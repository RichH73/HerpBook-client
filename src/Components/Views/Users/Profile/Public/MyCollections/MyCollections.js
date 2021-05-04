import React, { Component } from 'react';
import './Activity.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
import axios from 'axios';
import _ from 'lodash';
import dayjs from 'dayjs';
import Table from 'react-bootstrap/Table';

class MyCollections extends Component {
	state = {
		activities: [
			{
				date: dayjs(Date()).format('MMM DD, YYYY'),
				activityType: 'Reptile Show',
				activityLocation: 'Orlando',
			},
		],
	};

	componentDidMount() {}

	render() {
		const { activities } = this.state;
		return (
			<div className="my-profile-activity">
				<Table boreded>
					<thead>
						<tr>
							<th>Date</th>
							<th>Type</th>
							<th>Location</th>
						</tr>
					</thead>
					<tbody>
						{activities.map((activity) => (
							<tr>
								<td>{activity.date}</td>
								<td>{activity.activityType}</td>
								<td>Location: {activity.activityLocation}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	userInfo: state.user,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCollections);
