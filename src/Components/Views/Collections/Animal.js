import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';

import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';

class Animal extends Component {
	state = {};

	componentDidMount() {}

	render() {
		return (
			<div className="collections-animal-page">
				<div className="collection-animal-image">
					<img src="images/perry.jpg" />
				</div>
				<div className="collection-animal-common-info">
					<label>Name: </label>
					<div>
						<input type="text" name="name" placeholder="Perry" />
					</div>
					<label>ID #: </label>
					<div>
						<input type="text" name="name" placeholder="5e1fb48ee2dd8f353c06d765" />
					</div>
					<div>
						<label>Sex:</label>
						<div>
							<select>
								<option>Male</option>
								<option>Female</option>
								<option>Unknown</option>
							</select>
						</div>
						<label>DOB: </label>
						<div>
							<input type="text" name="name" placeholder="5e1fb48ee2dd8f353c06d765" />
						</div>
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
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Animal);
