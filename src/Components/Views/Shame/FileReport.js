//import date from 'date-and-time';
import './Shame.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import React, { Component } from 'react';
import { flatten, get } from 'lodash';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import ReactQuill from 'react-quill';
import QuillEmoji from 'quill-emoji';
//import Dropzone from "react-dropzone";
//import Editor from '../../functions/Editor'
// import floatingImage from '../../functions/imageFloatingDiv';

//Google analytics
import ReactGA from 'react-ga';

const incidentDescription =
	'Please include as many details as possible. DO NOT use foul language in your description. Do not use hyperlinks or email addresses.';

class Shame extends Component {
	modules = {
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

	onChangeHandler = (event) => {
		this.props.fileNewReport([event.target.name], event.target.value);
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
			data: fileData,
		}).then((res) => {
			if (res.status === 201) {
				this.props.imagesUploaded();
				this.props.clearRichText();
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
		// if(this.props.images.length > 5) {
		//   alert('Only 6 images are allowed per listing.')
		//   this.props.imagesUploaded();
		//   return
		// }

		// if(files.length > 5) {
		//   alert('Only 6 images are allowed per listing.')
		//   this.props.imagesUploaded();
		//   return
		// }

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

	render() {
		return !!this.props.uid.length ? (
			<React.Fragment>
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
					<div className="shame-file-report-business-name shame-report-form-input">
						<label className="shame-file-report-label">Business Name: </label>
						<input className="shame-file-report-input" type="text" name="business_name" onChange={this.onChangeHandler} />
					</div>

					<div className="shame-file-report-business-owner shame-report-form-input">
						<label className="shame-file-report-label">Owner Name: </label>
						<input className="shame-file-report-input" type="text" name="business_owner" onChange={this.onChangeHandler} />
					</div>

					<div className="shame-file-report-business-website shame-report-form-input">
						<label className="shame-file-report-label">Website Address: </label>
						<input className="shame-file-report-input" type="url" name="business_website" onChange={this.onChangeHandler} />
					</div>

					<div className="shame-file-report-business-email shame-report-form-input">
						<label className="shame-file-report-label">Business Email: </label>
						<input className="shame-file-report-input" type="email" name="business_email" onChange={this.onChangeHandler} />
					</div>

					<div className="shame-file-report-business-phone shame-report-form-input">
						<label className="shame-file-report-label">Business Phone: </label>
						<input className="shame-file-report-input" type="text" name="business_phone" onChange={this.onChangeHandler} />
					</div>

					<div className="shame-file-report-textarea">
						<label className="shame-file-report-label">Incident Description: </label>
						<ReactQuill
							style={{ backgroundColor: 'white', color: 'black' }}
							name="description"
							value={this.props.shameData.incident_description}
							onChange={this.descriptionChange}
							modules={this.modules}
							// modules={this.props.mods.modules}
							formats={this.formats}
							readOnly={false}
							theme="snow"
						/>
					</div>

					<div>
						{/* <Dropzone
              accept="image/*"
              onDrop={this.onPreviewDrop}
              maxSize={30000000}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div className="shame-file-reort-dropbox" {...getRootProps()}>
                    <span>
                      Drag and drop or click here to upload any supporting screen shots for this event.
                    </span>
                    <input {...getInputProps()} />
                  </div>
                </section>
              )}
            </Dropzone> */}
						{/* {this.props.images.length > 0 && (
              <div className="shame-file-report-preview">
                <h5>Image Preview</h5>
                <p>Click on an image to remove it.</p>
                {this.props.images.map(file => (
                  <img
                    alt="Preview"
                    key={file.preview}
                    src={file.preview}
                    onClick={() => this.clickHandler(file.path)}
                  />
                ))}
              </div>
            )} */}
					</div>
					<div className="wall-of-shame-file-submit">
						<button onClick={this.submitHandler}>Save</button>
					</div>
				</div>
			</React.Fragment>
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
	//saveImages: state.classifiedImages.sendFiles,
	//saveImages: state.wallOfShame.sendReportImages,
	text: state.richText.text,
	//image_array: state.classifiedImages.image_array,
	//images: state.classifiedImages.images,
	uid: state.user.uid,
	mods: state.richText.modules,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Shame);
