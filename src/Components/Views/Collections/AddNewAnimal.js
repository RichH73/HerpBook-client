import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import _ from 'lodash';

import axios from 'axios';
// import ReactGA from 'react-ga';

// import BarcodeReader from 'react-barcode-reader';
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

	componentWillUnmount() {
		this.props.imagesUploaded();
	}

	onSubmitHandler = (event) => {
		event.preventDefault();

		this.props.pageLoading(true);
		setTimeout(() => {
			this.props.pageLoading(false);
		}, 15000);
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

		axios({
			method: 'post',
			url: `${this.props.API}/collections/new_collection`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: fileData,
		})
			.then((response) => {
				this.props.pageLoading(false);
				if (response.status === 200) {
					this.props.imagesUploaded();
					this.props.currentAnimalDisplay(response.data);
					this.props.pageLoading(false);
					this.props.history.push('/view_animal');
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	category_menu = () => {
		const filteredItems = [5, 11];
		if (this.props.categoryItems.length > 0) {
			let filterCategories = this.props.categoryItems.filter((cat) => {
				return !_.includes(filteredItems, cat.id);
			});
			return filterCategories.map((category) => (
				<option key={category.name} value={category.id}>
					{category.name}
				</option>
			));
		}
	};

	sub_category_menu = () => {
		return _.filter(this.props.sub_categoryItems, ['category_id', _.toNumber(this.props.category)]).map((sub) => (
			<option key={sub.name} value={sub.id}>
				{sub.name}
			</option>
		));
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
		this.props.createAnimalData({
			[event.target.name]: event.target.value,
		});
	};

	categoryChangeHandler = (event) => {
		this.props.createAnimalData({
			[event.target.name]: _.toNumber(event.target.value),
		});
	};

	handleError(err) {
		console.error(err);
	}

	render() {
		return (
			<React.Fragment>
				<div style={{ margin: '2em auto', width: '85%' }}>
					<p>
						Fill in the following boxes to add a new animal to your collections. The bare minimum requirements are Category, Sub-category, and at
						least one image of the animal to get started.
					</p>
				</div>
				<div className="collections-create-new-animal">
					<div className="collections-create-new-animal-images">
						<ImageDrop imgDrop={{ className: 'collections-create-new-animal-img-drop' }} />
					</div>
					<div className="collections-create-new-animal-form">
						<div className="collections-create-new-animal-name">
							<label className="field-input-label">Name:</label>
							<div>
								<input type="text" name="name" onChange={this.formChangeHandler} />
							</div>
						</div>
						<div className="collections-create-new-animal-sire">
							<label className="field-input-label">Sire:</label>
							<div>
								<input type="text" name="sire" onChange={this.formChangeHandler} />
							</div>
						</div>
						<div className="collections-create-new-animal-dam">
							<label className="field-input-label">Dam:</label>
							<div>
								<input type="text" name="dam" onChange={this.formChangeHandler} />
							</div>
						</div>
						<div className="collections-create-new-animal-dob">
							<label className="field-input-label">DOB:</label>
							<div>
								<DatePicker showPopperArrow={false} selected={this.props.createAnimal.dob} onChange={(date) => this.handleDate(date)} />
							</div>
						</div>
						<div className="collections-create-new-animal-gender">
							<label className="field-input-label">Gender:</label>
							<div>
								<select name="gender" onChange={this.formChangeHandler}>
									<option>Choose</option>
									<option value="MALE">Male</option>
									<option value="FEMALE">Female</option>
									<option value="UNKNOWN">Unknown</option>
								</select>
							</div>
						</div>
						<div className="collections-create-new-animal-category">
							<label className="field-input-label">Category: </label>
							<select id="category" required name="category" onChange={this.categoryChangeHandler}>
								<option value="">Choose a category</option>
								{this.category_menu()}
							</select>
						</div>

						{!!this.props.createAnimal.category ? (
							<div className="collections-create-new-animal-sub-category">
								<label className="field-input-label">Sub category: </label>
								<select id="sub-category" required name="sub_category" onChange={this.categoryChangeHandler}>
									<option value="">Choose a category</option>
									{this.sub_category_menu()}
								</select>
							</div>
						) : (
							''
						)}
					</div>
					<div className="collections-create-new-animal-footer">
						<div className="collections-create-new-animal-button">
							<button
								className="button"
								disabled={!this.props.sendFiles.length || !this.props.createAnimal.category || !this.props.createAnimal.sub_category}
								onClick={this.onSubmitHandler}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	category: state.createNewAnimal.category,
	categoryItems: state.categories.categories,
	createAnimal: state.createNewAnimal,
	creatorId: state.user.uid,
	sendFiles: state.imageHandler.sendFiles,
	React: state.config.analytics,
	sub_categoryItems: state.categories.subCategories,
	URL: state.config.server.serverURL,
	userInfo: state.user,
	username: state.user.username,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewAnimal);
