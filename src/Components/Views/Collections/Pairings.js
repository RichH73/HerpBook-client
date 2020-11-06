import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';

import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';

const tableData = [
	{
		// pairing: {
		mate: '43gk4h4k26kh',
		date: '01/13/20',

		// }
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
				</tr>
			);
		});
	};

	render() {
		return (
			<React.Fragment>
				<table>
					<tr>
						<th>Mate</th>
						<th>Date</th>
					</tr>
					{this.pairMappings(tableData)}
				</table>
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
