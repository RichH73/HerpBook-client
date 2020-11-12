import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import _ from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import ReactQuill from 'react-quill';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import moment from 'moment';
import AlertModal from '../../../_services/Modal/Modal';

class Animal extends Component {
	state = {
		readOnly: true,
		modalIsOpen: true,
	};

	componentDidMount() {
		if (this.props.uid === this.props.currentAnimal.owner) {
			this.setState({ readOnly: false });
		}
	}

	// componentWillUnmount() {
	// 	this.props.hideLargeImage();
	// 	this.props.clearCurrentAnimalDisplay()
	// }

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
		const fd = dayjs(_.get(records, 'feeding.date'));
		const pd = dayjs(_.get(records, 'pairing.date'));
		if (!!_.get(records, 'feeding.date').length || !!_.get(records, 'pairing.date').length) {
			return (
				<div className="collections-animal-quick-records">
					Quick Records:
					<div className="collections-animal-quick-records-data">
						<table>
							<tbody>
								<tr>
									<td>Last Feeding</td>
									{!!_.get(records, 'feeding.date').length ? <td>Date: {`${fd.$M}/${fd.$D}/${fd.$y}`}</td> : ''}
									{!!_.get(records, 'feeding.feederType').length ? <td>Feeder Type: {_.get(records, 'feeding.feederType')}</td> : ''}
									{!!_.get(records, 'feeding.feederWeight').length ? <td>Feeder Weight: {_.get(records, 'feeding.feederWeight')}</td> : ''}
								</tr>
								<tr>
									<td>Last Pairing</td>
									{!!_.get(records, 'pairing.date').length ? <td>Date: {`${pd.$M}/${pd.$D}/${pd.$y}`}</td> : ''}
									{!!_.get(records, 'pairing.mate').length ? <td>Mate: {_.get(records, 'pairing.mate')}</td> : ''}
									{!!_.get(records, 'pairing.whitnessed').length ? <td>Whitnessed: {_.get(records, 'pairing.whitnessed')}</td> : ''}
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			);
		}
		return <React.Fragment></React.Fragment>;
	};

	viewRecord = (id) => {
		// this.props.setCurrentAnimal(id);
		//console.log(id);
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
				...this.props.currentAnimal,
			},
		}).then((response) => {
			console.log('my response', response);
		});
	};

	genderSelect = () => {
		switch (this.props.currentAnimal.gender) {
			case 'MALE':
				return (
					<select name="gender" onChange={this.onChangeHandler} disabled={this.state.readOnly}>
						<option></option>
						<option selected value="MALE">
							Male
						</option>
						<option value="FEMALE">Female</option>
						<option value="">Unknown</option>
					</select>
				);
			case 'FEMALE':
				return (
					<select name="gender" onChange={this.onChangeHandler} disabled={this.state.readOnly}>
						<option></option>
						<option value="MALE">Male</option>
						<option selected value="FEMALE">
							Female
						</option>
						<option value="">Unknown</option>
					</select>
				);
			case '':
				return (
					<select name="gender" onChange={this.onChangeHandler} disabled={this.state.readOnly}>
						<option></option>
						<option value="MALE">Male</option>
						<option value="FEMALE">Female</option>
						<option selected value="">
							Unknown
						</option>
					</select>
				);
		}
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
				if (response.status === 200) {
					this.props.currentAnimalDisplay(response.data);
					this.props.setPageTitle(`Viewing Collection: ${this.props.currentAnimal._id}`);
				}
				console.log('my response', response.data);
			})
			.catch((error) => {
				if (error) {
					console.log('An error has occured', error);
				}
			});
	};

	render() {
		const animal = this.props.currentAnimal;

		return (
			<div className="collections-animal-page">
				<div className="collection-animal-img-info">
					<div className="collection-animal-image">{this.showImage(animal.images)}</div>
					<div className="collection-animal-common-info">
						<div className="collection-animal-name">
							<label>Name:</label>
							<div>
								<input type="text" name="name" placeholder={animal.name} onChange={this.onChangeHandler} readOnly={this.state.readOnly} />
							</div>
						</div>

						<div className="collection-animal-id">
							<label>ID #:</label>
							<div>
								<input type="text" name="animalID" value={animal._id} />
							</div>
						</div>

						<div className="collection-animal-dob">
							<label>DOB:</label>
							<div>
								<DatePicker
									showPopperArrow={false}
									selected={!!this.props.currentAnimal.dob ? moment(this.props.currentAnimal.dob).toDate() : ''}
									onChange={this.dateHandler}
									readOnly={this.state.readOnly}
								/>
							</div>
						</div>

						<div className="collection-animal-sire">
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<label>Sire:</label>
								{!!animal.sire.length ? (
									<span name="viewLink" onClick={() => this.viewRecord(animal.sire)} onClick={() => this.searchId(animal.sire)}>
										view
									</span>
								) : (
									''
								)}
							</div>
							<div>
								<input type="text" name="sire" placeholder={animal.sire} onChange={this.onChangeHandler} readOnly={this.state.readOnly} />
							</div>
						</div>

						<div className="collection-animal-dam">
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<label>Dam:</label>
								{animal.dam.length ? <span name="viewLink">view</span> : ''}
							</div>
							<div>
								<input type="text" name="dam" placeholder={animal.dam} onChange={this.onChangeHandler} readOnly={this.state.readOnly} />
							</div>
						</div>
						<div className="collection-animal-gender">
							<label>Gender:</label>
							<div className="collection-animal-gender">{this.genderSelect()}</div>
						</div>
					</div>
				</div>
				<div className="collection-animal-body">
					{this.quickRecords(animal.quickRecords)}
					<div className="collection-animal-comments">
						<label>Notes:</label>
						<div className="collection-animal-comments-box">
							<ReactQuill
								style={{ backgroundColor: 'white', color: 'black' }}
								name="comments"
								value={animal.comments}
								onChange={this.handleChange}
								modules={this.props.mods.modules}
								formats={this.props.mods.formats}
								readOnly={this.state.readOnly}
								theme="snow"
							/>
						</div>
						<div>
							<button onClick={this.onSubmitHandler}>Update</button>
						</div>
					</div>
				</div>
				<AlertModal />
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
	mods: state.richText.modules,
	currentAnimal: state.viewAnimal,
	selectedAnimalId: state.selectedAnimal.id,
	collectionsIds: state.wholeCollection,
	collectionsData: state.wholeCollection.collections,
	commentBox: state.richText.text,
	uid: state.user.uid,
	modalState: state.alertModal.modalIsOpen,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Animal);
