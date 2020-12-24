import './FileReport.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import React, { Component } from 'react';
import { flatten, get } from 'lodash';
import axios from 'axios';
import { Link } from 'react-router-dom';
//import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import ReactQuill from 'react-quill';
import NumberFormat from 'react-number-format';
// eslint-disable-next-line
import QuillEmoji from 'quill-emoji';
//import Dropzone from "react-dropzone";
//import Editor from '../../functions/Editor'
// import floatingImage from '../../functions/imageFloatingDiv';

// Bootstrap imports
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

//Google analytics
import ReactGA from 'react-ga';

class Shame extends Component {
	modules = {
		imageCompress: {
			quality: 0.7, // default
			maxWidth: 400, // default
			maxHeight: 400, // default
			imageType: 'image/jpeg', // default
			debug: false, // default
		},
		toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['link', 'image', 'video'],
			['emoji'],
			['clean'],
		],
		'emoji-toolbar': true,
		'emoji-textarea': false,
		'emoji-shortname': true,
	};
	formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'emoji', 'link', 'image', 'video', 'clean'];
	// readOnly: false,
	// type: 'write'

	componentDidMount() {
		ReactGA.pageview('/file_shame');
	}

	componentWillUnmount() {
		this.props.clearShameText();
		this.props.clearNewShameReport();
	}

	onChangeHandler = (event) => {
		this.props.createNewReport([event.target.name], event.target.value);
	};

	submitHandler = (event) => {
		event.preventDefault();
		//let imageNames = []
		//let images = [];
		let fileData = new FormData();
		// const files = this.props.saveImages
		// files.forEach(file => {
		//   fileData.append("files", file);
		//   //imageNames.push(file.name)
		// });
		let reportData = {
			business_name: this.props.business_name,
			business_email: this.props.business_email,
			business_owner: this.props.business_owner,
			business_phone: this.props.business_phone,
			business_website: this.props.business_website,
			incident_description: this.props.incident_description,
			imgNames: this.props.saveImages,
			creatorId: this.props.uid,
		};
		fileData.append('reportData', JSON.stringify(reportData));
		axios({
			method: 'post',
			url: `${this.props.API}/shame/new_report`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
				enctype: 'mylipart/form-data',
			},
			data: this.props.reportData,
		}).then((res) => {
			if (res.status === 201) {
				this.props.imagesUploaded();
				this.props.clearShameText();
				this.props.history.push({
					pathname: '/success/classified_listing',
				});
			}
		});
		// }
	};

	descriptionChange = (value) => {
		this.props.shameText(value);
	};

	onPreviewDrop = (files) => {
		files.forEach((file) => {
			if (file.size >= 3000000) {
				this.setState({
					modal: 'block',
				});
			}
		});

		const saveFiles = files.map((file) => file);
		const newFile = files.map((file) => ({
			lastModified: file.lastModified,
			__proto__: file.__proto__,
			name: file.name,
			path: file.name,
			size: file.size,
			type: file.type,
			webkitRelativePath: file.webkitRelativePath,
			length: file.length,
			preview: URL.createObjectURL(file),
			id: file.name,
		}));
		this.props.classifiedImages({
			files: flatten([...get(this, 'props.images', []), newFile]),
			sendFiles: flatten([...get(this, 'props.sendFiles', []), saveFiles]),
			image_array: flatten([...(this, 'props.image_array', []), saveFiles]),
		});
	};

	clickHandler = (path) => {
		this.props.deleteImages(path);
	};

	reportFooter = () => {
		return (
			<React.Fragment>
				<Form.Group>
					<Form.Label>FaceBook Profile (https://www.facebook.com/): </Form.Label>
					<Form.Control type="text" name="faceBook" onChange={this.onChangeHandler} />
				</Form.Group>
				<Form.Group>
					<Form.Label>Incident Description</Form.Label>
					<ReactQuill
						style={{ backgroundColor: 'white', color: 'black' }}
						name="description"
						value={this.props.reportData.incident_description}
						onChange={this.descriptionChange}
						modules={this.modules}
						// modules={this.props.mods.modules}
						formats={this.formats}
						readOnly={false}
						theme="snow"
						required={true}
					/>
				</Form.Group>
				<div className="wall-of-shame-file-submit">
					<Button variant="success" disabled={this.props.fileReportData.incident_description.length >= 20 ? false : true}>
						Submit
					</Button>
				</div>
			</React.Fragment>
		);
	};

	returnForm = () => {
		switch (this.props.reportData.reportType) {
			case 'BUSINESS':
				return (
					<Form>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Business Name</Form.Label>
								<Form.Control type="text" name="business_name" required onChange={this.onChangeHandler} required />
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label>Owner Name</Form.Label>
								<Form.Control type="text" name="business_owner" onChange={this.onChangeHandler} />
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Phone</Form.Label>
								<NumberFormat
									format="+1 (###) ###-####"
									allowEmptyFormatting
									mask="_"
									onChange={this.onChangeHandler}
									name="business_phone"
									className="textInput form-control"
								/>
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" name="business_email" required onChange={this.onChangeHandler} />
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Website</Form.Label>
								<Form.Control type="url" name="business_website" required onChange={this.onChangeHandler} />
							</Form.Group>
						</Form.Row>
						{this.reportFooter()}
					</Form>
				);
			case 'INDIVIDUAL':
				return (
					<Form>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Name</Form.Label>
								<Form.Control type="text" name="individual_name" required onChange={this.onChangeHandler} />
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label>Website</Form.Label>
								<Form.Control type="url" name="individual_website" onChange={this.onChangeHandler} />
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Email: </Form.Label>
								<Form.Control type="email" name="individual_email" required onChange={this.onChangeHandler} />
							</Form.Group>
							<Form.Group as={Col}>
								<Form.Label>Phone</Form.Label>
								<NumberFormat
									format="+1 (###) ###-####"
									allowEmptyFormatting
									mask="_"
									onChange={this.onChangeHandler}
									name="individual_phone"
									className="textInput form-control"
								/>
							</Form.Group>
						</Form.Row>
						{this.reportFooter()}
					</Form>
				);
			default:
				return <React.Fragment></React.Fragment>;
		}
	};

	render() {
		return !!this.props.uid.length ? (
			<form onSubmit={this.submitHandler}>
				<div className="shame-file-report">
					<div className="shame-file-report-opening-paragraph">
						<p>
							Please use the following form to submit a report on a person or business. Please make every attempt to resolve any issues prior to
							filing a report. All reports filed will be reviewed prior to being listed on HerpBook.
						</p>
						<p>
							If you have had a report filed against you and feel this is incorrect please <Link to={'contact'}>contact us</Link>.
						</p>
					</div>
					<Form.Group>
						<Form.Label>
							<b>Report Type</b>
						</Form.Label>
						<Form.Control as="select" name="reportType" onChange={this.onChangeHandler}>
							<option selected value="">
								Choose type
							</option>
							<option value="BUSINESS">Business</option>
							<option value="INDIVIDUAL">Individual</option>
						</Form.Control>
					</Form.Group>
					{this.returnForm(this.props.reportData.reportType)}
				</div>
			</form>
		) : (
			<div className="shame-file-report">
				You must be <Link to="/login">logged in</Link> to file a report.
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	business_name: state.wallOfShame.business_name,
	business_email: state.wallOfShame.business_email,
	business_owner: state.wallOfShame.business_owner,
	business_phone: state.wallOfShame.business_phone,
	business_website: state.wallOfShame.business_website,
	incident_description: state.wallOfShame.incident_description,
	reportImages: state.wallOfShame.reportImages,
	viewImages: state.wallOfShame.reportImages,
	shameData: state.wallOfShame,
	fileReportData: state.fileShameReport,
	//saveImages: state.classifiedImages.sendFiles,
	//saveImages: state.wallOfShame.sendReportImages,
	text: state.richText.text,
	//image_array: state.classifiedImages.image_array,
	//images: state.classifiedImages.images,
	uid: state.user.uid,
	mods: state.richText.modules,
	reportData: state.fileShameReport,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Shame);
