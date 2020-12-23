import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import _ from 'lodash';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import ReactQuill from 'react-quill';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import AlertModal from '../../../../_services/Modal/Modal';
import './Animal.css';
import ReactTooltip from 'react-tooltip';

// Bootstrap imports
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

class Animal extends Component {
	state = {
		readOnly: true,
		modalIsOpen: true,
	};
	componentDidMount() {
		if (_.get(this.props, 'location.searchString')) {
			this.searchId(this.props.location.searchString);
		}
		if (this.props.uid === this.props.currentAnimal.owner) {
			this.setState({ readOnly: false });
		}
	}

	handleChange = (value) => {
		this.props.animalUpdate({
			comments: value,
		});
	};

	dateHandler = (date) => {
		this.props.animalUpdate({
			dob: date,
		});
	};

	onChangeHandler = (event) => {
		this.props.animalUpdate({ [event.target.name]: event.target.value });
	};

	quickRecords = () => {
		const records = this.props.currentAnimal.quickRecords;
		if (!!_.get(records, 'feeding.date', '').length || !!_.get(records, 'pairing.date', '').length) {
			return (
				<div className="collections-animal-quick-records">
					Quick Records
					<div className="collections-animal-quick-records-data">
						<Table bordered size={window.innerWidth < 600 ? 'sm' : 'md'}>
							<tbody>
								{!_.isEmpty(_.get(records, 'feeding')) ? (
									<tr>
										<td>Last Feeding</td>
										{!!_.get(records, 'feeding.date', '').length ? (
											<td>Date: {dayjs(_.get(records, 'feeding.date')).format('MM/DD/YYYY')}</td>
										) : (
											<td></td>
										)}
										{!!_.get(records, 'feeding.feederType', '').length ? <td>Feeder Type: {_.get(records, 'feeding.feederType')}</td> : <td></td>}
										{!!_.get(records, 'feeding.feederWeight', '').length ? (
											<td>Amout or weight: {_.get(records, 'feeding.feederWeight')}</td>
										) : (
											<td></td>
										)}
									</tr>
								) : (
									''
								)}
								{!_.isEmpty(_.get(records, 'pairing')) ? (
									<tr>
										<td>Last Pairing</td>
										{!!_.get(records, 'pairing.date', '').length ? (
											<td>Date: {dayjs(_.get(records, 'pairing.date')).format('MM/DD/YYYY')}</td>
										) : (
											<td></td>
										)}
										{!!_.get(records, 'pairing.mate', '').length ? <td>Mate: {_.get(records, 'pairing.mate')}</td> : <td></td>}
										<td>Whitnessed: {!!_.get(records, 'pairing.whitnessed') ? 'Yes' : 'No'}</td>
									</tr>
								) : (
									''
								)}
								{!_.isEmpty(_.get(records, 'shedding')) ? (
									<tr>
										<td>Last Shed</td>
										{!!_.get(records, 'shedding.date', '').length ? (
											<td>Date: {dayjs(_.get(records, 'shedding.date')).format('MM/DD/YYYY')}</td>
										) : (
											<td></td>
										)}
										{!!_.get(records, 'shedding.fullShed', '') ? <td>Complete Shed: Yes</td> : <td>Complete Shed: No</td>}
										<td></td>
									</tr>
								) : (
									''
								)}
								{!_.isEmpty(_.get(records, 'weight')) ? (
									<tr>
										<td>Last Weight</td>
										{!!_.get(records, 'weight.date', '').length ? (
											<td>Date: {dayjs(_.get(records, 'weight.date')).format('MM/DD/YYYY')}</td>
										) : (
											<td></td>
										)}
										{!!_.get(records, 'weight.weightUnit', '') ? (
											<td>
												Weight: {_.get(records, 'weight.weight', '')}
												{_.get(records, 'weight.weightUnit', '')}
											</td>
										) : (
											<td></td>
										)}
										<td></td>
									</tr>
								) : (
									''
								)}
							</tbody>
						</Table>
					</div>
				</div>
			);
		}
		return <React.Fragment></React.Fragment>;
	};

	largImage = (img) => {
		this.props.displayLargeImage({
			display: 'block',
			img: `${img.URL}/${img.large}`,
			name: img.large,
		});
	};

	showImage = (images) => {
		const firstImg = _.first(images);
		return (
			<img src={`${_.get(firstImg, 'URL')}/${_.get(firstImg, 'thumbnail')}`} alt={_.get(firstImg, 'name')} onClick={() => this.largImage(firstImg)} />
		);
	};

	onSubmitHandler = () => {
		const { collectionType, userCreatedID, name, dob, gender, sire, dam, isClassified, comments } = this.props.currentAnimal;
		let animalUpdate = {
			collectionType: collectionType,
			userCreatedID: userCreatedID,
			name: name,
			dob: dob,
			gender: gender,
			sire: sire,
			dam: dam,
			isClassified: isClassified,
			comments: comments,
		};

		this.props.modalSetState(true);
		setTimeout(() => {
			this.props.modalSetState(false);
		}, 2000);
		axios({
			method: 'post',
			url: `${this.props.API}/collections/update`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				collectionId: this.props.currentAnimal._id,
				update: animalUpdate,
			},
		}).then((response) => {});
	};

	permissionsCheck = () => {
		return 'readOnly';
	};

	searchId = (id) => {
		axios({
			method: 'post',
			url: `${this.props.API}/collections/search`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				id: id,
			},
		})
			.then((response) => {
				if (response.status === 201) {
					this.props.currentAnimalDisplay(response.data[0]);
					this.props.setPageTitle(`Viewing Collection: ${this.props.currentAnimal._id}`);
				}
			})
			.catch((error) => {
				if (error) {
					console.log('An error has occured', error);
				}
			});
	};

	sireDisplay = () => {
		const { category, sub_category, _id } = this.props.currentAnimal;
		let collections = this.props.collections;
		if (!sub_category) {
			collections = [];
		}
		if (!!sub_category) {
			collections = collections.filter((sub) => {
				if (sub.sub_category === _.toNumber(sub_category) && sub.gender === 'MALE' && sub._id !== _id) {
					return sub;
				}
			});
			return collections.map((collection) => <option value={collection._id}>{`${collection._id} / ${collection.name}`}</option>);
		}
	};

	damDisplay = () => {
		const { category, sub_category, _id } = this.props.currentAnimal;
		let collections = this.props.collections;
		if (!sub_category) {
			collections = [];
		}
		if (!!sub_category) {
			collections = collections.filter((sub) => {
				if (sub.sub_category === _.toNumber(sub_category) && sub.gender === 'FEMALE' && sub._id !== _id) {
					return sub;
				}
			});
			return collections.map((collection) => <option value={collection._id}>{`${collection._id} / ${collection.name}`}</option>);
		}
	};

	render() {
		const animal = this.props.currentAnimal;

		return (
			<React.Fragment>
				<div className="collections-animal-page">
					<div className="collection-animal-img-info">
						<div className="collection-animal-image">{this.showImage(animal.images)}</div>
						<div className="collection-animal-common-info">
							<Form>
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label size="md">ID #</Form.Label>
										<Form.Control type="text" name="animalID" value={animal._id} size="md" readOnly={true} size="md" />
									</Form.Group>

									<Form.Group as={Col}>
										<Form.Label size="md">Animal ID#</Form.Label>
										<Form.Control type="text" name="userCreatedID" value={animal.userCreatedID} onChange={this.onChangeHandler} size="md" />
									</Form.Group>
								</Form.Row>

								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Name</Form.Label>
										<Form.Control
											type="text"
											name="name"
											defaultValue={animal.name}
											onChange={this.onChangeHandler}
											readOnly={this.state.readOnly}
											size="md"
										/>
									</Form.Group>

									<Form.Group as={Col}>
										<Form.Label size="md">Gender</Form.Label>
										<Form.Control
											size="md"
											as="select"
											name="gender"
											onChange={this.onChangeHandler}
											disabled={this.state.readOnly}
											value={this.props.currentAnimal.gender}>
											<option value="MALE">Male</option>
											<option value="FEMALE">Female</option>
											<option value="UNKNOWN">Unknown</option>
										</Form.Control>
									</Form.Group>
								</Form.Row>

								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label size="md">Collection Type</Form.Label>
										<Form.Control as="select" name="collectionType" onChange={this.onChangeHandler} value={animal.collectionType} size="md">
											<option></option>
											<option value="SALE">Sale</option>
											<option value="PET">Pet</option>
											<option value="HOLDBACK">Holdback</option>
											<option value="BREEDER">Breeder</option>
										</Form.Control>
									</Form.Group>

									<Form.Group as={Col}>
										<Form.Label size="md">DOB</Form.Label>
										<Form.Control
											type="date"
											name="dob"
											value={dayjs(this.props.currentAnimal.dob).format('YYYY-MM-DD')}
											onChange={this.onChangeHandler}
											readOnly={this.state.readOnly}
											size="md"
										/>
									</Form.Group>
								</Form.Row>

								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label size="md">Sire</Form.Label>
										<Form.Control as="select" name="sire" onChange={this.onChangeHandler} value={animal.sire} size="md">
											<option value="">Unknown</option>
											{this.sireDisplay()}
										</Form.Control>
									</Form.Group>

									<Form.Group as={Col}>
										<Form.Label>Dam</Form.Label>
										<Form.Control as="select" name="dam" onChange={this.onChangeHandler} value={animal.dam} size="md">
											<option value="">Unknown</option>
											{this.damDisplay()}
										</Form.Control>
									</Form.Group>
								</Form.Row>
							</Form>
						</div>
					</div>
					<AlertModal />
				</div>
				<div className="collection-animal-body">
					<hr />
					{this.quickRecords(animal.quickRecords)}
					<div className="collection-animal-comments">
						<label className="field-input-label">Notes</label>
						<div className="collection-animal-comments-box">
							<ReactQuill
								name="comments"
								value={animal.comments}
								onChange={this.handleChange}
								modules={this.props.mods.modules}
								formats={this.props.mods.formats}
								readOnly={this.state.readOnly}
								theme="snow"
							/>
						</div>
						{!!this.state.readOnly ? (
							''
						) : (
							<div className="collection-animal-update-button">
								<Button variant="success" size="md" onClick={this.onSubmitHandler}>
									Update
								</Button>
							</div>
						)}
					</div>
				</div>
				<div style={{ zIndex: '-1', width: '0' }}>
					<ReactTooltip />
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
	collections: state.myCollections.collections,
	mods: state.richText.modules,
	currentAnimal: state.viewAnimal,
	selectedAnimalId: state.selectedAnimal.id,
	collectionsIds: state.myCollections,
	collectionsData: state.myCollections.collections,
	commentBox: state.richText.text,
	createAnimal: state.createNewAnimal,
	uid: state.user.uid,
	category: state.createNewAnimal.category,
	sub_categoryItems: state.categories.subCategories,
	modalState: state.alertModal.modalIsOpen,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Animal);
