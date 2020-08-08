import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import './dropzone.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import axios from 'axios';

class ImgDrop extends Component {
	state = {
		file: [],
	};

	submitHandler = (event) => {
		event.preventDefault();
		let fileData = new FormData();
		let imgFiles = this.props.sendFiles;
		_.forEach(imgFiles, function (file) {
			fileData.append('file', file);
		});
		axios({
			method: 'post',
			url: `${this.props.server_address}/listings/test_upload`,
			headers: {
				username: this.props.user,
				enctype: 'mylipart/form-data',
			},
			data: fileData,
		});
		// .then(response => {
		//   if (response.status === 200) {
		//     this.props.imagesUploaded();
		//     this.props.history.push({
		//       pathname: "/welcome"
		//     });
		//   }
		// });
	};

	clickHandler = (path) => {
		this.props.deleteImages(path);
	};

	onPreviewDrop = (files) => {
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
			files: _.flatten([...this.props.images, newFile]),
			sendFiles: _.flatten([...this.props.sendFiles, saveFiles]),
			image_array: _.flatten([...this.props.image_array, saveFiles]),
		});
	};

	render() {
		return (
			<div>
				<Dropzone accept="image/*" onDrop={this.onPreviewDrop}>
					{({ getRootProps, getInputProps }) => (
						<section>
							<div className="green-box dropbox" {...getRootProps()}>
								{this.props.innerMessage}
								<input {...getInputProps()} />
							</div>
						</section>
					)}
				</Dropzone>
				{this.props.images.length > 0 && (
					<div id="image-preview">
						<h4>Images</h4>
						{this.props.images.map((file) => (
							<img alt="Preview" key={file.preview} src={file.preview} onClick={() => this.clickHandler(file.path)} />
						))}
					</div>
				)}
				<button className="btn btn-outline-info" type="submit" onClick={this.submitHandler}>
					Update
				</button>

				<div>
					<div>base64 testing</div>
					<button onClick={this.sendIt}>click</button>
					<br />
					{Buffer.from('Hello World').toString('base64')}
					<br />
					{Buffer.from('SGVsbG8gV29ybGQ=', 'base64').toString('ascii')}
					<br />
					{Buffer.from(this.state.file, 'base64')}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	images: state.classifiedImages.images,
	sendFiles: state.classifiedImages.sendFiles,
	user: state.user.username,
	userInfo: state.user,
	username: state.user.username,
	title: state.listing.title,
	description: state.listing.description,
	price: state.listing.price,
	gender: state.listing.gender,
	shipping: false,
	weight: state.listing.weight,
	shipping_cost: state.listing.shipping_cost,
	sbnum: state.listing.category,
	category: state.listing.category,
	image_array: state.classifiedImages.image_array,
	sub_categoryItems: state.categories.sub_categories,
	picture: state.listing.picture,
	categoryItems: state.categories.categories,
	sub_categories: _.get(state, 'listing.sub_categories', []),
	sub_category: state.listing.sub_category,
	submenu: _.get(state, 'categories.sub_categories', []),
	listing: state.listing.images,
	server_address: state.config.server_address,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ImgDrop);
