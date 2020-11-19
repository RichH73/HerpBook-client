import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/index';
import Dropzone from 'react-dropzone';
import _ from 'lodash';

class ImageDrop extends React.Component {
	state = {};

	submitHandler = (event) => {
		event.preventDefault();
		this.props.pageLoading(true);
		let images = [];
		let fileData = new FormData();
		let imgFiles = this.props.sendFiles;
		_.forEach(imgFiles, function (file) {
			fileData.append('file', file);
			images.push(file.name);
		});
		let files = this.props.sendFiles;
		files.forEach((file) => {
			fileData.append('files', file);
		});
		let listingInfo = {
			creatorId: this.props.creatorId,
			description: this.props.listDescription,
			user: this.props.username,
			images: images,
			businessFooter: !!this.props.userInfo.businessFooter ? this.props.userInfo.businessFooter : null,
			...this.props.newLisingData,
		};
		fileData.append('listingInfo', JSON.stringify(listingInfo));
		axios({
			method: 'post',
			url: `${this.props.API}/listings/new_listing`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
				enctype: 'mylipart/form-data',
			},
			data: fileData,
		}).then((res) => {
			if (res.status === 201) {
				this.props.imagesUploaded();
				this.props.pageLoading(false);
				this.props.history.push({
					pathname: '/success/classified_listing',
				});
			}
		});
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
		this.props.imageHandler({
			files: _.flatten([..._.get(this, 'props.images', []), newFile]),
			sendFiles: _.flatten([..._.get(this, 'props.sendFiles', []), saveFiles]),
			image_array: _.flatten([...(this, 'props.image_array', []), saveFiles]),
		});
	};

	clickHandler = (path) => {
		this.props.deleteImages(path);
	};

	render() {
		return (
			<div className={this.props.imgDrop.className}>
				<Dropzone accept="image/*" onDrop={this.onPreviewDrop} maxSize={50000000}>
					{({ getRootProps, getInputProps }) => (
						<section>
							<div className={`${this.props.imgDrop.className}-dropbox`} {...getRootProps()}>
								<span>Please drag and drop your images into this box, or click the box to and them.</span>
								<input {...getInputProps()} />
							</div>
						</section>
					)}
				</Dropzone>
				{this.props.images.length > 0 && (
					<div className={`${this.props.imgDrop.className}-preview`}>
						<h5>Image Preview</h5>
						<label className="field-input-label">Click on an image to remove it.</label>
						<br />
						<div className="img-preview">
							{this.props.images.map((file) => (
								<div>
									<br />
									<img alt="Preview" key={file.preview} src={file.preview} onClick={() => this.clickHandler(file.path)} />
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	creatorId: state.user.uid,
	image_array: state.imageHandler.image_array,
	images: state.imageHandler.images,
	imgs: state.imageHandler.image_array,
	picture: state.listing.picture,
	price: state.listing.price,
	sbnum: state.listing.category,
	sendFiles: state.imageHandler.sendFiles,
	API: state.config.server.serverAPI,
	token: state.user.token,
	user: state.user.username,
	userInfo: state.user,
	username: state.user.username,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(ImageDrop);
