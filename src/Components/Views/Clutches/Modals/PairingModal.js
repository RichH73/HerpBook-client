import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import { get } from 'lodash';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import NumberFormat from 'react-number-format';

//import ReactGA from 'react-ga';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

class PairingModal extends Component {
	state = {
		readOnly: true,
	};

	closeModal = () => {
		this.props.closePairingModal();
	};

	successfulBreedingCheck = () => {
		let successful = this.props.pairingRecord.successful;
		if (!successful) {
			this.props.clutchesPairingRecordEdit({
				successful: true,
			});
		}
		if (!!successful) {
			this.props.clutchesPairingRecordEdit({
				successful: false,
			});
		}
	};
	whitnessedBreedingCheck = () => {
		let whitnessed = this.props.pairingRecord.whitnessed;
		if (!whitnessed) {
			this.props.clutchesPairingRecordEdit({
				whitnessed: true,
			});
		}
		if (!!whitnessed) {
			this.props.clutchesPairingRecordEdit({
				whitnessed: false,
			});
		}
	};

	onChangeHandler = (event) => {
		this.props.clutchesPairingRecordEdit({
			[event.target.name]: event.target.value,
		});
	};

	render() {
		const data = this.props.pairingRecord;
		return (
			<Modal show={this.props.pairingModal} onHide={this.closeModal}>
				<Modal.Header closeButton>
					<Modal.Title>Pairing Record</Modal.Title>
				</Modal.Header>
				<Modal.Body>
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
						</Form.Row>
						<Form.Group>
							<Form.Label>Notes: </Form.Label>
							<ReactQuill
								style={{ backgroundColor: 'white', color: 'black' }}
								name="comments"
								value={data.notes}
								onChange={this.noteHandler}
								modules={this.props.mods.modules}
								formats={this.props.mods.formats}
								readOnly={this.state.readOnly}
								theme="snow"
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={this.closeModal}>
						Close
					</Button>
					<Button variant="primary" onClick={this.closeModal}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	userInfo: state.user,
	clutches: state.my_clutches.clutchData,
	collections: state.myCollections.collections,
	clutch: state.my_clutches.editClutch,
	pairingRecord: state.my_clutches.pairingRecord,
	pairingModal: state.my_clutches.pairingModal,
	mods: state.richText,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PairingModal);
