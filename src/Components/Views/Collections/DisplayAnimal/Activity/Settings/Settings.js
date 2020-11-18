import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
import './Settings.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';

class Settings extends Component {
	state = {};

	componentDidMount() {}

	deleteRecord = () => {
		axios({
			url: `${this.props.API}/collections/delete_collection`,
			method: 'post',
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				_id: this.props.currentAnimal._id,
			},
		})
			.then((response) => {
				if (response.status === 200) {
					this.props.history.push({
						pathname: '/my_collections',
					});
				}
			})
			.catch((error) => console.log(error));
	};

	submit = () => {
		confirmAlert({
			title: 'Confirm record delete',
			message: `Once a record is deleted, all saved data associated with that record is gone forever. Are you sure to delete this record?`,
			buttons: [
				{
					label: 'Yes',
					onClick: () => this.deleteRecord(),
				},
				{
					label: 'No',
					onClick: () => {
						return;
					},
				},
			],
		});
	};

	render() {
		return (
			<div>
				<div>
					<label>Active:</label>
					<select>
						<option value={true}>Yes</option>
						<option value={false}>No</option>
					</select>
				</div>
				<div>
					Remove this animal record?
					<br />
					<button className="button">Update</button>
					<button className="button danger" onClick={this.submit}>
						Delete
					</button>
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
	urlImg: state.bar_img.img,
	currentAnimal: state.viewAnimal,
	selectedAnimalId: state.selectedAnimal.id,
	collectionsIds: state.wholeCollection,
	recordOverlay: state.editRecord,
	notesText: state.richText.text,
	mods: state.richText,
	imgSrc: state.bar_img.img,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
