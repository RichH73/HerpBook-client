import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import axios from 'axios';
//import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import NumberFormat from 'react-number-format';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import './Forms.css';

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
		const data = this.props.recordOverlay;
		const gender = this.props.currentAnimal.gender;
		switch (this.props.recordOverlay.recordType) {
			case 'feedings':
				return (
					<React.Fragment>
						<div className="collections-feeding-records-editor-body">
							<div className="collections-feeding-records-editor-feeding-date">
								<label className="field-input-label">Date:</label>
								{/* defaultValue={`${fd.$M + 1}/${fd.$D}/${fd.$y}`} */}
								<div>
									<DatePicker showPopperArrow={false} selected={!!date ? new Date(date) : ''} onChange={this.handleDate} />
								</div>
							</div>
							<div className="collections-feeding-records-editor-feeding-type">
								<label className="field-input-label">Type of feeder:</label>
								<div>
									<input type="text" name="feederType" defaultValue={data.feederType} onChange={this.onChangeHandler} />
								</div>
							</div>
							<div className="collections-feeding-records-editor-feeding-weight">
								<label className="field-input-label">Weight or amount:</label>
								<div>
									<input type="text" name="feederWeight" defaultValue={data.feederWeight} onChange={this.onChangeHandler} />
								</div>
							</div>
							<div className="collections-feeding-records-editor-feeding-notes">
								<label className="field-input-label">Notes:</label>
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
			case 'weights':
				return (
					<React.Fragment>
						<div className="collections-weight-records-editor-body">
							<div className="collections-weight-records-editor-shedding-date">
								<label className="field-input-label">Date:</label>
								<div>
									<DatePicker showPopperArrow={false} selected={!!date ? new Date(date) : ''} onChange={this.handleDate} />
								</div>
							</div>
							<div>
								<label>Weight:</label>
								<div>
									<NumberFormat
										thousandSeparator={true}
										defaultValue={this.props.recordOverlay.weight}
										allowNegative={false}
										fixedDecimalScale={2}
										onChange={this.onChangeHandler}
										name="weight"
									/>
									<select name="weightUnit" onChange={this.onChangeHandler}>
										<option>Unit</option>
										<option selected value="gm">
											gm
										</option>
										<option value="kg">kg</option>
										<option value="oz">oz</option>
										<option value="lb">lb</option>
									</select>
								</div>
							</div>
							<div className="collections-weight-records-editor-weight-notes">
								<label className="field-input-label">Notes:</label>
								<div>
									<ReactQuill
										style={{ backgroundColor: 'white', color: 'black' }}
										name="notes"
										value={this.props.recordOverlay.notes}
										onChange={this.noteHandler}
										modules={this.props.mods.modules}
										formats={this.props.mods.formats}
										readOnly={this.state.readOnly}
										theme="snow"
									/>
								</div>
							</div>
							<div className="collections-weight-records-editor-weight-buttons">
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
			case 'sheddings':
				return (
					<React.Fragment>
						<div className="collections-shedding-records-editor-body">
							<div className="collections-shedding-records-editor-shedding-date">
								<label className="field-input-label">Date:</label>
								<div>
									<DatePicker showPopperArrow={false} selected={!!date ? new Date(date) : ''} onChange={this.handleDate} />
								</div>
							</div>
							<div className="collections-shedding-records-editor-shedding-type">
								<label className="field-input-label">Complete Shed:</label>
								<div>
									<select name="fullShed" defaultValue={data.fullShed} onChange={this.onChangeHandler}>
										<option value={true}>Yes</option>
										<option value={false}>No</option>
									</select>
								</div>
							</div>
							<div className="collections-shedding-records-editor-shedding-notes">
								<label className="field-input-label">Notes:</label>
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
							<div className="collections-shedding-records-editor-shedding-buttons">
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
			case 'pairings':
				return (
					<React.Fragment>
						<div className="collections-pairing-records-editor-body">
							<div className="collections-pairing-records-editor-pairing-date">
								<label className="field-input-label">Date: </label>
								<DatePicker showPopperArrow={false} selected={!!date ? new Date(date) : ''} onChange={this.handleDate} />
							</div>

							<div className="collections-pairing-records-editor-pairing-mate">
								<label className="field-input-label">Mate: </label>
								<input type="text" name="mate" defaultValue={data.mate} onChange={this.onChangeHandler} />
							</div>

							<div className="collections-pairing-records-editor-pairing-whitnessed">
								<label className="field-input-label">Whitnessed: </label>
								<select name="whitnessed" defaultValue={data.whitnessed} onChange={this.onChangeHandler}>
									<option></option>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
							</div>

							<div className="collections-pairing-records-editor-pairing-successful">
								<label className="field-input-label">Successful: </label>
								<select name="successful" defaultValue={data.successful} onChange={this.onChangeHandler}>
									<option></option>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
							</div>
							{/* Hide if male */}
							{gender === 'FEMALE' ? (
								<React.Fragment>
									<div className="collections-pairing-records-editor-pairing-clutch-info">
										<div className="collections-pairing-records-editor-pairing-clutch-size">
											<label className="field-input-label">Clutch Size: </label>
											<NumberFormat
												thousandSeparator={false}
												defaultValue={data.clutchSize}
												allowNegative={false}
												onChange={this.onChangeHandler}
												name="clutchSize"
											/>
										</div>

										<div className="collections-pairing-records-editor-pairing-clutch-infertile">
											<label className="field-input-label">Infertile Amount: </label>
											<NumberFormat
												thousandSeparator={false}
												defaultValue={data.infertile}
												allowNegative={false}
												onChange={this.onChangeHandler}
												name="infertile"
											/>
										</div>

										<div className="collections-pairing-records-editor-pairing-clutch-fertile">
											<label className="field-input-label">Fertile Amount: </label>
											<NumberFormat
												thousandSeparator={false}
												defaultValue={data.fertile}
												allowNegative={false}
												onChange={this.onChangeHandler}
												name="fertile"
											/>
										</div>
									</div>

									<div className="collections-pairing-records-editor-pairing-clutch-id">
										<label className="field-input-label">Clutch ID: </label>
										<input type="text" name="clutchId" defaultValue={data.clutchId} readOnly={true} onChange={this.onChangeHandler} />
										{!data.clutchId ? (
											<span
												onClick={() =>
													this.new_clutch({
														record: this.props.recordOverlay,
														dam: this.props.currentAnimal,
													})
												}
											>
												{' '}
												Create new clutch?
											</span>
										) : (
											''
										)}
									</div>
								</React.Fragment>
							) : (
								''
							)}
							{/* Finish Hiding */}
							<div className="collections-pairing-records-editor-pairing-notes">
								<label className="field-input-label">Notes: </label>
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

	new_clutch = (clutch_data) => {
		this.props.new_clutch_data(clutch_data);
		axios({
			method: 'post',
			url: `${this.props.API}/clutches/new_clutch`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				clutch_data,
			},
		})
			.then((response) => {
				if (response.status === 201) {
					this.props.pageLoading(false);
					//TODO correct error for next line.
					this.porps.current_clutch_data(response.new_clutch);
					this.porps.all_clutch_data(response.clutches);
				}
			})
			.catch((error) => {
				console.log(error);
			});
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
