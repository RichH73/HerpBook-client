import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import './AddNewAnimal.css';
import _ from 'lodash';

import axios from 'axios';
import ReactGA from 'react-ga';

// import BarcodeReader from 'react-barcode-reader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import ImageDrop from '../../../_services/ImageDrop';

//Bootstrap imports
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

class AddNewAnimal extends Component {
	state = {
		startDate: '',
	};

	componentDidMount() {
		this.props.setPageTitle('Add a new animal');
		this.props.getMyCollections({ uid: this.props.userInfo.uid });
		ReactGA.pageview('/new_collection');
	}

	componentWillUnmount() {
		this.props.imagesUploaded();
		this.props.clearAnimalData();
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

	sireDisplay = () => {
		const { sub_category } = this.props.createAnimal;
		let collections = this.props.collections;
		if (!sub_category) {
			collections = [];
		}
		if (!!sub_category) {
			collections = collections.filter((sub) => {
				if (sub.sub_category === _.toNumber(sub_category) && sub.gender === 'MALE' && sub.collectionType === 'BREEDER') {
					return sub;
				}
			});
		}
		return collections.map((collection) => <option value={collection._id}>{`${collection._id} / ${collection.name}`}</option>);
	};

	damDisplay = () => {
		const { category, sub_category } = this.props.createAnimal;
		let collections = this.props.collections;
		if (!sub_category) {
			collections = [];
		}
		if (!!sub_category) {
			collections = collections.filter((sub) => {
				if (sub.sub_category === _.toNumber(sub_category) && sub.gender === 'FEMALE' && sub.collectionType === 'BREEDER') {
					return sub;
				}
			});
		}
		return collections.map((collection) => <option value={collection._id}>{`${collection._id} / ${collection.name}`}</option>);
	};

	render() {
		return (
			<React.Fragment>
				<div className="collections-create-new-animal">
					<Form autocomplete="off" onSubmit={this.submitHandler}>
						<Form.Row>
							<Form.Group as={Col} controlId="formGridType">
								<Form.Label>Collection Type</Form.Label>
								<Form.Control as="select" name="collectionType" onChange={this.formChangeHandler} size="md">
									<option>Choose</option>
									<option value="SALE">Sale</option>
									<option value="PET">Pet</option>
									<option value="HOLDBACK">Holdback</option>
									<option value="BREEDER">Breeder</option>
								</Form.Control>
							</Form.Group>

							<Form.Group as={Col} controlId="formGridPassword">
								<Form.Label>Animal ID</Form.Label>
								<Form.Control minLength="8" type="text" name="userCreatedID" onChange={this.formChangeHandler} size="md" />
							</Form.Group>
						</Form.Row>

						<Form.Row>
							<Form.Group as={Col} xs={8} controlId="formGridName">
								<Form.Label>Name</Form.Label>
								<Form.Control type="email" name="name" onChange={this.formChangeHandler} size="md" />
							</Form.Group>

							<Form.Group as={Col} controlId="formGridType">
								<Form.Label>Gender</Form.Label>
								<Form.Control as="select" name="gender" onChange={this.formChangeHandler} size="md">
									<option>Choose</option>
									<option value="Male">Male</option>
									<option value="FEMALE">Female</option>
									<option value="UNKNOWN">Unknown</option>
								</Form.Control>
							</Form.Group>
						</Form.Row>

						<Form.Row>
							<Form.Group as={Col} controlId="formGridType">
								<Form.Label>Category</Form.Label>
								<Form.Control required as="select" name="category" onChange={this.formChangeHandler} size="md">
									<option value="">Choose a category</option>
									{this.category_menu()}
								</Form.Control>
							</Form.Group>

							<Form.Group as={Col} controlId="formGridType">
								<Form.Label>Sub Category</Form.Label>
								<Form.Control
									required
									as="select"
									name="sub_category"
									onChange={this.formChangeHandler}
									disabled={!this.sub_category_menu().length}
									size="md">
									<option value="">Choose a sub_category</option>
									{this.sub_category_menu()}
								</Form.Control>
							</Form.Group>
						</Form.Row>

						<Form.Row>
							<Form.Group as={Col} controlId="formGridDOB">
								<Form.Label size="md">DOB</Form.Label>
								<Form.Control size="md" type="date" name="dob" placeholder="Enter Date" onChange={this.formChangeHandler} />
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col} controlId="formGridType">
								<Form.Label>Sire</Form.Label>
								<Form.Control as="select" name="sire" onChange={this.formChangeHandler} disabled={!this.damDisplay().length} size="md">
									<option value="">Sire</option>
									{this.sireDisplay()}
								</Form.Control>
							</Form.Group>

							<Form.Group as={Col} controlId="formGridType">
								<Form.Label>Dam</Form.Label>
								<Form.Control as="select" name="dam" onChange={this.formChangeHandler} disabled={!this.damDisplay().length} size="md">
									<option value="">Dam</option>
									{this.damDisplay()}
								</Form.Control>
							</Form.Group>
						</Form.Row>

						<Form.Row></Form.Row>
						<div>
							<ImageDrop imgDrop={{ className: 'collections-create-new-animal-img-drop' }} />
						</div>
						<div className="collections-create-new-animal-button">
							<Button variant="success" type="submit" size="md">
								Submit
							</Button>
						</div>
					</Form>
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
	collections: state.myCollections.collections,
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
