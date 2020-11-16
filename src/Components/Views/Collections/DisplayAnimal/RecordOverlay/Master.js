import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import axios from 'axios';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import './Forms.css';
import Editor from '../../../../_functions/Editor';

class Master extends Component {
	state = {};

	cancelEdit = (event) => {
		this.props.clearRecordsEditor();
	};

	onChangeHandler = (event) => {
		this.props.recordsEditor({
			[event.target.name]: event.target.value,
		});
	};

	handleDate = (date) => {
		this.props.recordsEditor({
			date: date,
		});
	};

	noteHandler = (note) => {
		this.props.recordsEditor({
			notes: note,
		});
	};

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
					this.props.recordsEditor({
						_id: '',
						recordType: '',
						display: 'none',
						date: '',
						_id: '',
						record: {
							feederType: '',
							feederWeight: '',
							notes: '',
						},
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	updateRecord = () => {
		//alert('Do you want to delete this record?')
		const collectionId = this.props.currentAnimal._id;
		const recordData = this.props.recordOverlay;

		this.props.pageLoading(true);
		setTimeout(() => {
			this.props.pageLoading(false);
		}, 10000);
		axios({
			method: 'post',
			url: `${this.props.API}/collections/update_record`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				typeToUpdate: recordData.recordType,
				recordToUpdate: recordData._id,
				collectionId: collectionId,
				update: recordData,
			},
		})
			.then((response) => {
				if (response.status === 201) {
					this.props.pageLoading(false);
					this.props.currentAnimalDisplay(response.data[0]);
					this.cancelEdit();
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	ReturnRecord = () => {
		const date = this.props.recordOverlay.date;
		const fd = dayjs(this.props.recordOverlay.date);
		const data = this.props.recordOverlay;
		switch (this.props.recordOverlay.recordType) {
			case 'feeding':
				return (
					<React.Fragment>
						<div className="collections-feeding-records-editor-body">
							<div className="collections-feeding-records-editor-feeding-date">
								<label>Date:</label>
								{/* defaultValue={`${fd.$M + 1}/${fd.$D}/${fd.$y}`} */}
								<div>
									<DatePicker showPopperArrow={false} selected={!!date ? moment(date).toDate() : ''} onChange={this.handleDate} />
								</div>
							</div>
							<div className="collections-feeding-records-editor-feeding-type">
								<label>Type of feeder:</label>
								<div>
									<input type="text" name="feederType" defaultValue={data.feederType} onChange={this.onChangeHandler} />
								</div>
							</div>
							<div className="collections-feeding-records-editor-feeding-weight">
								<label>Weight or amount:</label>
								<div>
									<input type="text" name="feederWeight" defaultValue={data.feederWeight} onChange={this.onChangeHandler} />
								</div>
							</div>
							<div className="collections-feeding-records-editor-feeding-notes">
								<label>Notes:</label>
								<div>
									<ReactQuill
										style={{ backgroundColor: 'white', color: 'black' }}
										name="comments"
										value={this.props.recordOverlay.notes}
										onChange={this.noteHandler}
										modules={this.props.mods.modules}
										formats={this.props.mods.formats}
										readOnly={this.state.readOnly}
										theme="snow"
									/>
								</div>
							</div>
							<div className="collections-feeding-records-editor-feeding-buttons">
								<button className="button" onClick={this.deleteRecord}>
									Delete
								</button>
								<button className="button" onClick={this.updateRecord}>
									Save
								</button>
								<button className="button" onClick={this.cancelEdit}>
									Cancel
								</button>
							</div>
						</div>
					</React.Fragment>
				);
			case 'pairing':
				return (
					<React.Fragment>
						<div className="collections-pairing-records-editor-body">
							<div className="collections-pairing-records-editor-pairing-date">
								<label>Date: </label>
								<DatePicker showPopperArrow={false} selected={!!date ? moment(date).toDate() : ''} onChange={this.handleDate} />
							</div>

							<div className="collections-pairing-records-editor-pairing-mate">
								<label>Mate: </label>
								<input type="text" name="mate" defaultValue={data.mate} onChange={this.onChangeHandler} />
							</div>

							<div className="collections-pairing-records-editor-pairing-whitnessed">
								<label>Whitnessed: </label>
								<select name="whitnessed" defaultValue={data.whitnessed} onChange={this.onChangeHandler}>
									<option></option>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
							</div>

							<div className="collections-pairing-records-editor-pairing-successful">
								<label>Successful: </label>
								<select name="successful" defaultValue={data.successful} onChange={this.onChangeHandler}>
									<option></option>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
							</div>

							<div className="collections-pairing-records-editor-pairing-clutch-info">
								<div className="collections-pairing-records-editor-pairing-clutch-size">
									<label>Clutch Size: </label>
									<input type="number" name="clutchSize" maxLength={2} onChange={this.onChangeHandler} />
								</div>

								<div className="collections-pairing-records-editor-pairing-clutch-infertile">
									<label>Infertile Amount: </label>
									<input type="number" name="infertile" defaultValue={data.infertile} maxLength={2} onChange={this.onChangeHandler} />
								</div>

								<div className="collections-pairing-records-editor-pairing-clutch-fertile">
									<label>Fertile Amount: </label>
									<input type="number" name="fertile" defaultValue={data.fertile} maxLength={2} onChange={this.onChangeHandler} />
								</div>
							</div>

							<div className="collections-pairing-records-editor-pairing-clutch-id">
								<label>Clutch ID: </label>
								<input type="text" name="clutchId" defaultValue={data.clutchId} readOnly={true} onChange={this.onChangeHandler} />
							</div>

							<div className="collections-pairing-records-editor-pairing-notes">
								<label>Notes: </label>
								<div>
									<ReactQuill
										style={{ backgroundColor: 'white', color: 'black' }}
										name="comments"
										value={this.props.recordOverlay.notes}
										onChange={this.noteHandler}
										modules={this.props.mods.modules}
										formats={this.props.mods.formats}
										readOnly={this.state.readOnly}
										theme="snow"
									/>
								</div>
							</div>

							<div className="collections-pairing-records-editor-pairing-buttons">
								<button className="button" onClick={this.deleteRecord}>
									Delete
								</button>
								<button className="button" onClick={this.updateRecord}>
									Save
								</button>
								<button className="button" onClick={this.cancelEdit}>
									Cancel
								</button>
							</div>
						</div>
					</React.Fragment>
				);
			default:
				return <div>No record selected</div>;
		}
	};

	render() {
		const { display } = this.props.recordOverlay;
		return (
			<React.Fragment>
				<div className="collection-edit-record-main-panel" style={{ display: display }}>
					<div className="collection-edit-record-header">
						<h4>Edit record</h4>
					</div>
					<div className="collection-edit-record-body">
						<p>You can edit this record then click save to save all data, or click delete to remove.</p>
						{this.ReturnRecord()}
					</div>
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
	React: state.config.analytics,
	currentAnimal: state.viewAnimal,
	selectedAnimalId: state.selectedAnimal.id,
	collectionsIds: state.wholeCollection,
	recordOverlay: state.editRecord,
	notesText: state.richText.text,
	mods: state.richText,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Master);
