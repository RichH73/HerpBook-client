import { isThisHour } from 'date-fns';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import axios from 'axios';

class Master extends Component {
	state = {};

	deleteRecord = () => {
		//alert('Do you want to delete this record?')
		const collectionId = this.props.currentAnimal._id;
		const recordData = this.props.recordOverlay;

		this.props.pageLoading(true);
		setTimeout(() => {
			this.props.pageLoading(false);
		}, 10000);
		axios({
			method: 'post',
			url: `${this.props.API}/collections/delete_record`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				typeToDelete: recordData.recordType,
				recordToDelete: recordData._id,
				collectionId: collectionId,
			},
		})
			.then((response) => {
				if (response.status === 201) {
					this.props.pageLoading(false);
					this.props.currentAnimalDisplay(response.data[0]);
					this.props.recordsEitor({
						_id: '',
						recordType: '',
						display: 'none',
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	ReturnRecord = () => {
		const data = this.props.recordOverlay.recordData;
		switch (this.props.recordOverlay.recordType) {
			case 'feeding':
				return (
					<React.Fragment>
						<div>
							<label>Date:</label>
							<div>
								<input type="text" defaultValue={data.date} />
							</div>
							<button className="button" onClick={this.deleteRecord}>
								Delete
							</button>
							<button className="button" onClick={this.editingRecord}>
								Save
							</button>
							<button className="button" onClick={this.editingRecord}>
								Cancel
							</button>
						</div>
					</React.Fragment>
				);
		}
	};

	editingRecord = (event) => {
		event.preventDefault();
		this.props.recordsEitor({
			_id: '',
			recordType: '',
			display: 'none',
		});
	};

	render() {
		const { display } = this.props.recordOverlay;
		return (
			<div className="collection-edit-record-main-panel" style={{ display: display }}>
				<div className="collection-edit-record-header">
					<h4>Edit record</h4>
				</div>
				<p>You can edit this record then click save to save all data, or click delete to remove.</p>
				{this.ReturnRecord()}
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
	currentAnimal: state.viewAnimal,
	selectedAnimalId: state.selectedAnimal.id,
	collectionsIds: state.wholeCollection,
	recordOverlay: state.editRecord,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Master);
