import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import _ from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import ReactQuill from 'react-quill';
import LargeImage from '../../_services/DisplayLargeImage/LargeImage';

class Animal extends Component {
	state = {};

	componentDidMount() {
		const animal = this.props.collectionsData.filter((collection) => {
			return collection._id === this.props.selectedAnimalId;
		})[0];
		this.props.currentAnimalDisplay(animal);
	}

	componentWillUnmount() {
		this.props.hideLargeImage();
	}

	searchId = (id) => {};

	handleChange = (value) => {
		this.props.editText({
			text: value,
		});
	};

	quickRecords = (animal) => {
		let feedings = animal.feedings.pop();
		let lastPairing = animal.pairings.pop();
		return (
			<div className="collections-animal-quick-records">
				Quick Records
				<div className="collections-animal-quick-records-data">
					<table>
						<tr>
							<td>Last Feeding</td>
							<td>Date: {feedings.date}</td>
							<td>Feeder Type: {feedings.feederType}</td>
							<td>Feeder Weight: {feedings.feederWeight}</td>
						</tr>
						<tr>
							<td>Last Pairing</td>
							<td>Date: {lastPairing.date}</td>
							<td>Mate: {lastPairing.mate}</td>
							<td>Whitnessed: {lastPairing.whitnessed}</td>
						</tr>
					</table>
				</div>
			</div>
		);
	};

	viewRecord = (id) => {
		// this.props.setCurrentAnimal(id);
		console.log(id);
	};

	largImage = (img) => {
		console.log('i clicky the thing', img);
		this.props.displayLargeImage({
			display: 'block',
			img: `${img.URL}/${img.large}`,
			name: img.large,
		});
	};

	showImage = (images) => {
		const firstImg = _.first(images);
		console.log('url', _.get(firstImg, 'URL'));
		return (
			<img src={`${_.get(firstImg, 'URL')}/${_.get(firstImg, 'thumbnail')}`} alt={_.get(firstImg, 'name')} onClick={() => this.largImage(firstImg)} />
		);
	};

	render() {
		const animal = this.props.currentAnimal;

		return (
			<div className="collections-animal-page">
				<div className="collection-animal-img-info">
					<div className="collection-animal-image">
						{this.showImage(animal.images)}
						{/* <img src="images/perry.jpg" /> */}
					</div>
					<div className="collection-animal-common-info">
						<div className="collection-animal-name">
							<label>Name:</label>
							<div>
								<input type="text" name="animalName" placeholder={animal.name} />
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
								<input type="text" name="animalDOB" placeholder={animal.dob} />
							</div>
						</div>

						<div className="collection-animal-sire">
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<label>Sire:</label>
								{!!animal.sire.length ? (
									<span name="viewLink" onClick={() => this.viewRecord(animal.sire)}>
										view
									</span>
								) : (
									''
								)}
							</div>
							<div>
								<input type="text" name="animalSire" placeholder={animal.sire} />
							</div>
						</div>

						<div className="collection-animal-dam">
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<label>Dam:</label>
								{animal.dam.length ? <span name="viewLink">view</span> : ''}
							</div>
							<div>
								<input type="text" name="animalDam" placeholder={animal.dam} />
							</div>
						</div>
						<div className="collection-animal-gender">
							<label>Gender:</label>
							<div className="collection-animal-gender">
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
					{/* {this.quickRecords(animal)} */}
					<div className="collection-animal-comments">
						<label>Comments:</label>
						<div>
							<ReactQuill
								style={{ backgroundColor: 'white', color: 'black' }}
								name="businessFooter"
								value={animal.comments}
								onChange={this.handleChange}
								modules={this.props.mods.modules}
								formats={this.props.mods.formats}
								readOnly={false}
								theme="snow"
							/>
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
	mods: state.richText.modules,
	currentAnimal: state.viewAnimal,
	selectedAnimalId: state.selectedAnimal.id,
	collectionsIds: state.wholeCollection,
	collectionsData: state.wholeCollection.collections,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Animal);
