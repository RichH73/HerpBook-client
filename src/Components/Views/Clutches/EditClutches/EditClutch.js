import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import { first, get, toNumber } from 'lodash';
import './EditClutch.css';
import dayjs from 'dayjs';
import PairingModal from '../Modals/PairingModal';
import ReactTooltip from 'react-tooltip';
import ReactQuill from 'react-quill';
import NumberFormat from 'react-number-format';

import axios from 'axios';
// import ReactGA from 'react-ga';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

class EditClutch extends Component {
	state = {
		startDate: '',
		pairModal: true,
	};

	componentDidMount() {
		const searchId = this.props.match.params.id;
		if (!this.props.clutches.length) {
			this.props.getMyClutches();
		}
		if (!!this.props.match.params.id) {
			let clutch = this.props.clutches.filter((clutch) => {
				if (clutch._id === searchId) return clutch;
			});
			if (!!clutch.length) {
				this.props.loadClutch(first(clutch));
			}
		}
	}

	componentDidUpdate(prevProps) {
		const searchId = this.props.match.params.id;
		if (prevProps.clutches !== this.props.clutches) {
			let clutch = this.props.clutches.filter((clutch) => {
				if (clutch._id === searchId) return clutch;
			});
			if (!!clutch.length) {
				this.props.loadClutch(first(clutch));
			}
		}
	}

	componentWillUnmount() {
		this.props.loadClutch();
	}

	closeModal = () => {
		this.setState({
			pairModal: false,
		});
	};

	collectionRecords = (clutch) => {
		const { collections } = this.props;
		const collection = collections.filter((collection) => {
			if (clutch.dam === collection._id) {
				return collection;
			}
		});
		const pairRecord = get(collection, '0.pairings').filter((pair) => {
			if (clutch.recordId === pair._id) {
				return pair;
			}
		});
		this.props.loadPairingRecord(first(pairRecord));
		this.props.openPairingModal();
	};

	onSubmitHandler = () => {
		const { clutch } = this.props;
		//event.preventDefault();

		const clutchUpdate = {
			category: toNumber(clutch.category),
			sub_category: toNumber(clutch.sub_category),
			notes: clutch.notes,
			sire: clutch.sire,
			dam: clutch.dam,
			layDate: clutch.layDate,
			eggCount: toNumber(clutch.eggCount),
			hatchCount: toNumber(clutch.hatchCount),
			images: clutch.images,
			hatchlings: clutch.hatchlings,
			owner: clutch.owner,
			directory: clutch.directory,
			URL: clutch.URL,
			active: clutch.active,
			incubationTemp: clutch.incubationTemp,
			recordId: clutch.recordId,
		};

		this.props.updateClutch({
			clutchId: clutch._id,
			update: clutchUpdate,
		});
	};

	viewModal = () => {};

	handleScan(data) {
		this.setState({
			result: data,
		});
	}

	handleDate = (date) => {
		this.props.createAnimalData({
			dob: date,
		});
	};

	formChangeHandler = (event) => {
		this.props.createAnimalData({
			[event.target.name]: event.target.value,
		});
	};

	handleError(err) {
		console.error(err);
	}

	goBack = () => {
		this.props.history.goBack();
	};

	onChangeHandler = (event) => {
		this.props.clutchRecordEdit({
			[event.target.name]: event.target.value,
		});
	};

	eggHatch = () => {
		const clutch = this.props.clutch;
		const unHatched = clutch.eggCount - clutch.hatchlings.length;
		if (!unHatched) {
			return;
		}
		return (
			<React.Fragment>
				<Form.Row>
					<Form.Group as={Col}>
						<Form.Text as="p">
							When an egg hatches you can click the "Hatch Egg" button to create a new hatchling record. This will create a new hatchling record.
						</Form.Text>
					</Form.Group>
				</Form.Row>
				<Form.Group as={Col}>
					<Form.Label>Create Hatchlings</Form.Label>
					<InputGroup className="mb-3">
						<Form.Control type="text" value={!!clutch.hatchlings ? `Unhatched eggs left: ${unHatched}` : ''} />
						<InputGroup.Append>
							<Button variant="success" onClick={this.hatchEgg} disabled={!unHatched}>
								Hatch Egg
							</Button>
						</InputGroup.Append>
					</InputGroup>
				</Form.Group>
			</React.Fragment>
		);
	};

	hatchEgg = () => {
		this.props.newHatchling({
			hatchling: {
				URL: '',
				hatchDate: new Date(),
			},
			clutch: this.props.clutch,
		});
	};

	showHatchlings = () => {
		const hatchlings = this.props.clutch.hatchlings;
		if (!!hatchlings.length) {
			return (
				<Form.Row>
					{hatchlings.map((hatchling) => (
						<Form.Group as={Col}>
							<Form.Label>Hatchling</Form.Label>
							<Form.Control
								type="text"
								value={hatchling._id}
								onClick={() =>
									this.props.history.push({
										pathname: `/edit_animal/${hatchling._id}`,
										// id: hatchling._id,
									})
								}
								readOnly
							/>
						</Form.Group>
					))}
				</Form.Row>
			);
		}
	};

	notesHandler = (text) => {
		this.props.clutchRecordEdit({ notes: text });
	};

	render() {
		const { clutch } = this.props;

		/*
	_id: mongoose.Schema.Types.ObjectId,
	category: Number,
	sub_category: Number,
	notes: String,
	sire: String,
	dam: String,
				layDate: Date,
				eggCount: Number,
	hatchCount: Number,
	images: [images],
	hatchlings: [hatchlings],
	owner: String,
	directory: String,
	URL: String,
	active: Boolean,
	incubationTemp: String,
	recordId: String,

	*/
		return (
			<React.Fragment>
				<ReactTooltip />
				<div className="edit-clutch-form-body">
					<Form>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Lay Date</Form.Label>
								<Form.Control type="date" value={dayjs(clutch.layDate).format('YYYY-MM-DD')} />
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label>Pairing Record</Form.Label>
								<Form.Control
									type="text"
									value={clutch.recordId}
									onClick={() => this.collectionRecords(clutch)}
									data-tip="Click to view/edit pairing record."
									readOnly
								/>
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Sire</Form.Label>
								<Form.Control type="text" readOnly value={clutch.sire} />
							</Form.Group>
							<Form.Group as={Col}>
								<Form.Label>Dam</Form.Label>
								<Form.Control type="text" readOnly value={clutch.dam} />
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Incubation Temp</Form.Label>
								<NumberFormat
									thousandSeparator={false}
									className="form-control form-control-md"
									value={clutch.incubationTemp}
									allowNegative={false}
									fixedDecimalScale={1}
									onChange={this.onChangeHandler}
									name="incubationTemp"
								/>
							</Form.Group>
							<Form.Group as={Col}>
								<Form.Label>Total Eggs</Form.Label>
								<NumberFormat
									thousandSeparator={false}
									className="form-control form-control-md"
									value={clutch.eggCount}
									allowNegative={false}
									fixedDecimalScale={1}
									onChange={this.onChangeHandler}
									name="eggCount"
								/>
							</Form.Group>
						</Form.Row>

						<Form.Row>{this.eggHatch()}</Form.Row>
						{this.showHatchlings()}
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Notes</Form.Label>
								<ReactQuill
									style={{ backgroundColor: 'white', color: 'black' }}
									name="businessFooter"
									value={clutch.notes}
									onChange={this.notesHandler}
									modules={this.props.mods.modules}
									formats={this.props.mods.formats}
									readOnly={false}
									theme="snow"
								/>
							</Form.Group>
						</Form.Row>
					</Form>
					<Button onClick={this.goBack}>Back</Button> <Button onClick={this.onSubmitHandler}>Update</Button>
				</div>
				<PairingModal />
			</React.Fragment>
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
	mods: state.richText,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditClutch);

/*
category: Number,
  sub_category: Number,
  notes: String,
  sire: String,
  dam: String,
  layDate: Date,
  eggCount: Number,
  hatchCount: Number,
  images: [images],
  hatchlings: [hatchlings],
  owner: String,
  directory: String,
  URL: String,
  active: Boolean,
  incubationTemp: String
*/
