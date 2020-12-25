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
import { get } from 'lodash';

// Bootstrap imports
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import dayjs from 'dayjs';

class Master extends Component {
	state = {
		modalOpen: false,
		weightModal: false,
		feedModal: false,
		editModal: false,
	};

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
			date: dayjs(date.target.value).toString(),
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

	successfulBreedingCheck = () => {
		let successful = this.props.recordOverlay.successful;
		if (!successful) {
			this.props.recordsEditor({
				successful: true,
			});
		}
		if (!!successful) {
			this.props.recordsEditor({
				successful: false,
			});
		}
	};
	whitnessedBreedingCheck = () => {
		let whitnessed = this.props.recordOverlay.whitnessed;
		if (!whitnessed) {
			this.props.recordsEditor({
				whitnessed: true,
			});
		}
		if (!!whitnessed) {
			this.props.recordsEditor({
				whitnessed: false,
			});
		}
	};

	ReturnRecord = () => {
		const { recordOverlay } = this.props;
		const date = this.props.recordOverlay.date;
		const data = this.props.recordOverlay;
		const gender = this.props.currentAnimal.gender;
		switch (this.props.recordOverlay.recordType) {
			case 'feedings':
				return (
					<Form>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Date</Form.Label>
								<Form.Control type="date" value={dayjs(data.date).format('YYYY-MM-DD')} onChange={this.handleDate} />
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Type of feeder</Form.Label>
								<Form.Control type="text" name="feederType" value={data.feederType} onChange={this.onChangeHandler} />
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Weight or amount</Form.Label>
								<Form.Control type="text" name="feederWeight" value={data.feederWeight} onChange={this.onChangeHandler} />
							</Form.Group>
						</Form.Row>
						<div className="collections-feeding-records-editor-feeding-notes">
							<Form.Label>Notes</Form.Label>
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
					</Form>
				);
			case 'weights':
				return (
					<Form>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Date</Form.Label>
								<Form.Control type="date" name="date" onChange={this.handleDate} value={dayjs(recordOverlay.date).format('YYYY-MM-DD')} size="md" />
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label>Weight</Form.Label>
								<InputGroup>
									<NumberFormat
										thousandSeparator={true}
										className="form-control form-control-md"
										defaultValue={recordOverlay.weight}
										allowNegative={false}
										fixedDecimalScale={2}
										onChange={this.onChangeHandler}
										name="weight"
									/>
									<Form.Control as="select" name="weightUnit" onChange={this.onChangeHandler} value={recordOverlay.weightUnit} size="md">
										<option value="gm">Grams</option>
										<option value="kg">Kilograms</option>
										<option value="oz">Ounces</option>
										<option value="lb">Pounds</option>
									</Form.Control>
								</InputGroup>
							</Form.Group>
						</Form.Row>
						<div className="collections-weight-records-editor-weight-notes">
							<Form.Label>Notes</Form.Label>
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
					</Form>
				);
			case 'sheddings':
				return (
					<Form>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Date</Form.Label>
								<Form.Control type="date" value={dayjs(data.date).format('YYYY-MM-DD')} onChange={this.handleDate} />
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Complete Shed</Form.Label>
								<Form.Control as="select" name="fullShed" value={data.fullShed} onChange={this.onChangeHandler}>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</Form.Control>
							</Form.Group>
						</Form.Row>
						<div className="collections-shedding-records-editor-shedding-notes">
							<Form.Label>Notes:</Form.Label>
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
					</Form>
				);
			case 'pairings':
				return (
					<Form>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Breeding Record ID</Form.Label>
								<Form.Control type="text" value={data._id} readOnly />
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Date</Form.Label>
								<Form.Control type="date" value={dayjs(data.date).format('YYYY-MM-DD')} onChange={this.handleDate} />
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label>Mate</Form.Label>
								<Form.Control type="text" name="mate" value={data.mate} onChange={this.onChangeHandler} />
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Check
									label="Whitnessed"
									name="whitnessed"
									checked={data.whitnessed}
									onChange={this.whitnessedBreedingCheck}
									className="collection-edit-record-main-panel-switch"
								/>
							</Form.Group>
							<Form.Group as={Col}>
								<Form.Check
									label="Successful"
									name="successful"
									checked={data.successful}
									onChange={this.successfulBreedingCheck}
									className="collection-edit-record-main-panel-switch"
								/>
							</Form.Group>
						</Form.Row>
						{/* Hide if male */}
						{gender === 'FEMALE' && !!data.successful ? (
							<Form>
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Clutch total</Form.Label>
										<NumberFormat
											className="form-control form-control-md"
											thousandSeparator={false}
											value={data.clutchSize}
											allowNegative={false}
											onChange={this.onChangeHandler}
											name="clutchSize"
										/>
									</Form.Group>

									<Form.Group as={Col}>
										<Form.Label>Infertile total</Form.Label>
										<NumberFormat
											className="form-control form-control-md"
											thousandSeparator={false}
											value={data.infertile}
											allowNegative={false}
											onChange={this.onChangeHandler}
											name="infertile"
										/>
									</Form.Group>

									<Form.Group as={Col}>
										<Form.Label>Fertile total</Form.Label>
										<NumberFormat
											className="form-control form-control-md"
											thousandSeparator={false}
											value={data.fertile}
											allowNegative={false}
											onChange={this.onChangeHandler}
											name="fertile"
										/>
									</Form.Group>
								</Form.Row>
								<Form.Row>
									<Form.Label>Clutch ID: </Form.Label>
									<Form.Control type="text" name="clutchId" value={get(data, 'clutchId', ' ')} readOnly={true} onChange={this.onChangeHandler} />
									{!data.clutchId ? (
										<span
											onClick={() =>
												this.new_clutch({
													record: this.props.recordOverlay,
													dam: this.props.currentAnimal,
												})
											}>
											{' '}
											Create new clutch?
										</span>
									) : (
										''
									)}
								</Form.Row>
							</Form>
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
					</Form>
				);
			default:
				return <div>No record selected</div>;
		}
	};

	updateCurrentRecordEdit = async (data) => {
		console.log('running with data: ', data);
		await this.props.recordsEditor({ clutchId: data._.id });
		//await this.porps.current_clutch_data(data);
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
					let dataObj = Object.assign({}, get(response, 'data.new_clutch'));
					this.props.pageLoading(false);
					this.props.recordsEditor({ clutchId: get(response, 'data.new_clutch._id') });
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	closeModal = (event) => {
		this.setState({
			modalOpen: false,
		});
	};
	openModal = () => {
		this.setState({
			modalOpen: true,
		});
	};
	confirmDelete = () => {
		this.deleteRecord();
		this.props.clearRecordsEditor();
		this.setState({
			modalOpen: false,
		});
	};

	render() {
		const { display } = this.props.recordOverlay;
		const { recordOverlay } = this.props;
		return (
			<React.Fragment>
				<div className="collection-edit-record-main-panel" style={{ display: display }}>
					<div className="collection-delete-record">
						<Modal show={this.state.modalOpen} onHide={this.closeModal}>
							<Modal.Header>
								<Modal.Title>Record Delete</Modal.Title>
							</Modal.Header>
							<Modal.Body>Are you sure you want to delete this record? Once deleted this information will be lost forever.</Modal.Body>
							<Modal.Footer>
								<Button variant="success" onClick={this.closeModal}>
									Cancel
								</Button>{' '}
								<Button variant="danger" onClick={this.confirmDelete}>
									Delete
								</Button>{' '}
							</Modal.Footer>
						</Modal>
					</div>
					<div className="collection-edit-record-modal">
						<Modal show={recordOverlay.editModal} onHide={this.closeModal}>
							<Modal.Header>
								<Modal.Title>Edit Record</Modal.Title>
							</Modal.Header>
							<Modal.Body>{this.ReturnRecord()}</Modal.Body>
							<Modal.Footer>
								<Button variant="warning" onClick={this.openModal}>
									Delete
								</Button>{' '}
								<Button variant="success" onClick={this.updateRecord}>
									Save
								</Button>{' '}
								<Button variant="light" onClick={this.cancelEdit}>
									Cancel
								</Button>
							</Modal.Footer>
						</Modal>
					</div>
					<div className="collection-edit-record-header">
						<h4>Edit record</h4>
					</div>
					<div className="collection-edit-record-body">
						<p>You can edit this record then click save to save all data, or click delete to remove.</p>
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
	collectionsIds: state.myCollections,
	recordOverlay: state.editRecord,
	notesText: state.richText.text,
	mods: state.richText,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Master);

/*
<React.Fragment>
				<div className="collection-edit-record-main-panel" style={{ display: display }}>
					<div className="collection-edit-record-modal">
						<Modal show={this.state.modalOpen} onHide={this.closeModal}>
							<Modal.Header>
								<Modal.Title>Record Delete</Modal.Title>
							</Modal.Header>
							<Modal.Body>Are you sure you want to delete this record? Once deleted this information will be lost forever.</Modal.Body>
							<Modal.Footer>
								<Button variant="success" onClick={this.closeModal}>
									Cancel
								</Button>{' '}
								<Button variant="danger" onClick={this.confirmDelete}>
									Delete
								</Button>{' '}
							</Modal.Footer>
						</Modal>
					</div>
					<div>
						<Modal show={recordOverlay.editModal} onHide={this.closeModal}>
							<Modal.Header>
								<Modal.Title>Edit Feed Record</Modal.Title>
							</Modal.Header>
							<Modal.Body>{this.ReturnRecord()}</Modal.Body>
							<Modal.Footer>
								<Button variant="warning" onClick={this.openModal}>
									Delete
								</Button>{' '}
								<Button variant="success" onClick={this.updateRecord}>
									Save
								</Button>{' '}
								<Button varient="success" onClick={this.cancelEdit}>
									Cancel
								</Button>
							</Modal.Footer>
						</Modal>
					</div>
					<div className="collection-edit-record-header">
						<h4>Edit record</h4>
					</div>
					<div className="collection-edit-record-body">
						<p>You can edit this record then click save to save all data, or click delete to remove.</p>
					</div>
				</div>
			</React.Fragment>
*/
