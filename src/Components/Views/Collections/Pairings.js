import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';

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
		return data.map((pair) => {
			return (
				<tr>
					<td>{pair.mate}</td>
					<td>{pair.date}</td>
					<td>{pair.whitnessed}</td>
				</tr>
			);
		});
	};

	render() {
		return (
			<React.Fragment>
				<div className="collections-pairing-page">
					<div>
						<div>New Pairing</div>
						<input type="text" />
					</div>
				</div>
				<div className="collections-pairing-table">
					<table>
						<tr>
							<th>Mate</th>
							<th>Date</th>
							<th>Whitnessed</th>
						</tr>
						{this.pairMappings(tableData)}
					</table>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	userInfo: state.user,
	React: state.config.analytics,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Pairings);
