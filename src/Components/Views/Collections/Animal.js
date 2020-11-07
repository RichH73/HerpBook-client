import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import _ from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';

class Animal extends Component {
	state = {};

	componentDidMount() {}

	displayRecords = (records) => {
		records = '';
		if (!!records.length) {
			return <div className="collections-animal-quick-records">Quick Records</div>;
		}
	};

	render() {
		return (
			<div className="collections-animal-page">
				<div className="collection-animal-img-info">
					<div className="collection-animal-image">
						<img src="images/perry.jpg" />
					</div>
					<div className="collection-animal-common-info">
						<div className="collection-animal-name">
							<label>Name:</label>
							<div>
								<input type="text" name="animalName" placeholder="" />
							</div>
						</div>

						<div className="collection-animal-id">
							<label>ID #:</label>
							<div>
								<input type="text" name="animalID" placeholder="" />
							</div>
						</div>

						<div className="collection-animal-dob">
							<label>DOB:</label>
							<div>
								<input type="text" name="animalDOB" placeholder="" />
							</div>
						</div>

						<div className="collection-animal-sire">
							<label>Sire:</label>
							<div>
								<input type="text" name="animalSire" placeholder="" />
							</div>
						</div>

						<div className="collection-animal-dam">
							<label>Dam:</label>
							<div>
								<input type="text" name="animalDam" placeholder="" />
							</div>
						</div>
						<div className="collection-animal-gender">
							<label>Sex:</label>
							<div className="collection-animal-sex">
								<select>
									<option>Male</option>
									<option>Female</option>
									<option>Unknown</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<div className="collection-animal-body">
					{this.displayRecords()}
					<div className="collection-animal-comments">
						<label>Comments:</label>
						<div>
							<textarea type="text" name="animalComment" placeholder="" />
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
