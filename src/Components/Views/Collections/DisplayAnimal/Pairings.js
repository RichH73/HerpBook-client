import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';

import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';

const tableData = [
	{
		mate: '43gk4h4k26kh',
		date: '01/13/20',
		whitnessed: 'No',
	},
	{
		mate: '43gk4h4k26kh',
		date: '03/02/20',
		whitnessed: 'Yes',
	},
	{
		mate: '67gerh4k26kh',
		date: '04/21/20',
		whitnessed: 'No',
	},
	{
		mate: '43gg345k26kh',
		date: '08/10/20',
		whitnessed: 'No',
	},
];

class Pairings extends Component {
	state = {};

	componentDidMount() {}

	pairMappings = (data) => {
		return this.props.currentAnimal.pairings.map((pair) => {
			return (
				<div className="collections-animal-records-feedings">
					<table>
						<tbody>
							<th>Date</th>
							<th>Mate</th>
							<th>Whitnessed</th>
							<tr onClick={() => console.log(pair)}>
								<td>{pair.date}</td>
								<td>{pair.mate}</td>
								<td>{pair.whitnessed}</td>
							</tr>
						</tbody>
					</table>
				</div>
			);
		});
	};

	render() {
		return (
			<div style={{ padding: '10px' }}>
				<div className="collections-pairing-page">
					<div>
						<div>New Pairing</div>
						<input type="text" />
					</div>
				</div>
				<div className="collections-pairing-table">{this.pairMappings(tableData)}</div>
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
