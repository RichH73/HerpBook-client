import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import _ from 'lodash';

import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';

import BarcodeReader from 'react-barcode-reader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import ImageDrop from '../../_services/ImageDrop';

class AddNewAnimal extends Component {
	state = {
		startDate: '',
	};

	componentDidMount() {
		this.props.getMyCollections({ uid: this.props.userInfo.uid });
	}

	onSubmitHandler = (event) => {
		event.preventDefault();

		//this.props.pageLoading(true);
		let images = [];
		let fileData = new FormData();
		let imgFiles = this.props.sendFiles;
		_.forEach(imgFiles, function (file) {
			fileData.append('file', file);
			images.push(file.name);
		});
		let files = this.props.sendFiles;
		files.forEach((file) => {
			fileData.append('files', file);
		});
		let newCollectionInfo = {
			owner: this.props.creatorId,
			user: this.props.username,
			images: images,
			...this.props.createAnimal,
		};
		fileData.append('newCollectionInfo', JSON.stringify(newCollectionInfo));

		console.log(fileData);

		// let newCollectionInfo = this.props.createAnimal
		// Object.assign(newCollectionInfo, {owner: this.props.userInfo.uid})
		axios({
			method: 'post',
			url: `${this.props.API}/collections/new_collection`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: fileData,
		}).then((response) => {
			console.log(response.data);
		});
	};

	handleScan(data) {
		this.setState({
			result: data,
		});
	}

	handleDate = (date) => {
		this.props.createAnimalData({
			dob: date,
		});
	};

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
				<div className="collections-create-new-animal-images">
					<ImageDrop imgDrop={{ className: 'collections-create-new-animal-img-drop' }} />
				</div>
				<div className="collections-create-new-animal-form">
					<div className="collections-create-new-animal-name">
						<label>Name:</label>
						<div>
							<input type="text" name="name" onChange={this.formChangeHandler} />
						</div>
					</div>
					<div className="collections-create-new-animal-sire">
						<label>Sire:</label>
						<div>
							<input type="text" name="sire" onChange={this.formChangeHandler} />
						</div>
					</div>
					<div className="collections-create-new-animal-dam">
						<label>Dam:</label>
						<div>
							<input type="text" name="dam" onChange={this.formChangeHandler} />
						</div>
					</div>
					<div className="collections-create-new-animal-dob">
						<label>DOB:</label>
						<div>
							<DatePicker showPopperArrow={false} selected={this.props.createAnimal.dob} onChange={(date) => this.handleDate(date)} />
						</div>
					</div>
					<div className="collections-create-new-animal-gender">
						<label>Gender:</label>
						<div>
							<select name="gender" onChange={this.formChangeHandler}>
								<option>Choose</option>
								<option value="MALE">Male</option>
								<option value="FEMALE">Female</option>
								<option value="UNKNOWN">Unknown</option>
							</select>
						</div>
					</div>
				</div>
				<div className="collections-create-new-animal-footer">
					<div className="collections-create-new-animal-button">
						<button onClick={this.onSubmitHandler}>Save</button>
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
	createAnimal: state.createNewAnimal,
	sendFiles: state.imageHandler.sendFiles,
	creatorId: state.user.uid,
	username: state.user.username,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewAnimal);
