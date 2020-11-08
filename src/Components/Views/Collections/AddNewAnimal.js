import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';

import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';

import BarcodeReader from 'react-barcode-reader';

class AddNewAnimal extends Component {
	state = {
		data: 'Not Found',
	};

	componentDidMount() {
		this.props.getMyCollections({ uid: this.props.userInfo.uid });
	}

	handleScan(data) {
		this.setState({
			result: data,
		});
	}

	formChangeHandler = (event) => {
		console.log(event);
		this.props.createAnimalData({
			[event.target.name]: event.target.value,
		});
	};

	handleError(err) {
		console.error(err);
	}

	render() {
		return (
			<div className="collections-create-new-animal">
				<div className="collections-create-new-animal-images"></div>
				<div className="collections-create-new-animal-form">
					<div>
						<label>Name:</label>
						<div>
							<input type="text" name="name" onChange={this.formChangeHandler} />
						</div>
					</div>
					<div>
						<label>Sire:</label>
						<div>
							<input type="text" name="sire" onChange={this.formChangeHandler} />
						</div>
					</div>
					<div>
						<label>Dam:</label>
						<div>
							<input type="text" name="dam" onChange={this.formChangeHandler} />
						</div>
					</div>
					<div>
						<label>DOB:</label>
						<div>
							<input type="text" name="dob" onChange={this.formChangeHandler} />
						</div>
					</div>
					<div>
						<button>Save</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddNewAnimal);
