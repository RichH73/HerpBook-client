import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import _, { last } from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import ReactQuill from 'react-quill';

class Animal extends Component {
	state = {};

	componentDidMount() {}

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

		//   if (!!animal) {
		// 	let lastPairing = animal.pairings.pop();
		//   return (
		//     <div className="collections-animal-quick-records">
		//       <b>Quick Records</b>
		//       <div className="collections-animal-quick-records-data">
		//         <table>
		// 		  {myTest}
		//           <tr>
		//             <td>Last Feeding</td>
		//             <td>Date: {lastFeeding.date}</td>
		//             <td>Feeder Type: {lastFeeding.foodType}</td>
		//             <td>Feeder Weight: {lastFeeding.foodWeight}</td>
		//           </tr>
		//           <tr>
		//             <td>Last Pairing</td>
		//             <td>Date: {lastPairing.date}</td>
		//             <td>Mate: {lastPairing.mate}</td>
		//             <td>Whitnessed: {lastPairing.whitnessed}</td>
		//           </tr>
		//         </table>
		//       </div>
		//       <div>Last Shed: {animal.lastShed}</div>
		//       <div>Weight: {animal.weight}</div>
		//     </div>
		//   );
		// }
	};

	viewRecord = (id) => {
		this.props.setCurrentAnimal(id);
	};

	render() {
		const animal = this.props.collectionsData.filter((collection) => {
			return collection._id === this.props.selectedAnimalId;
		})[0];

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
					{this.quickRecords(animal)}
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
