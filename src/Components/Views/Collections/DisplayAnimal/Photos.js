import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import dayjs from 'dayjs';
import _ from 'lodash';
import axios from 'axios';
import ImageDrop from '../../../_services/ImageDrop';
import Button from 'react-bootstrap/Button';
class Photos extends Component {
	state = {};

	componentDidMount() {}

	addImages = () => {
		this.props.pageLoading(true);
		setTimeout(() => {
			if (this.props.spinnerState === 'block') {
				this.props.pageLoading(false);
			}
		}, 10000);

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
		let collectionInfo = {
			owner: this.props.creatorId,
			collectionId: this.props.currentAnimal._id,
			images: images,
			...this.props.createAnimal,
		};

		fileData.append('collectionInfo', JSON.stringify(collectionInfo));

		axios({
			method: 'post',
			url: `${this.props.API}/collections/add_images`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: fileData,
		})
			.then((response) => {
				if (response.status === 201) {
					this.props.imagesUploaded();
					this.props.currentAnimalDisplay(response.data[0]);
					this.props.pageLoading(false);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	deleteImage = (image) => {
		this.props.pageLoading(true);
		setTimeout(() => {
			if (this.props.spinnerState === 'block') {
				this.props.pageLoading(false);
			}
		}, 10000);
		axios({
			method: 'post',
			url: `${this.props.API}/collections/remove_image`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				image: {
					collectionId: this.props.currentAnimal._id,
					_id: image._id,
				},
			},
		})
			.then((response) => {
				if (response.status === 201) {
					//this.props.clearCurrentAnimalDisplay();
					this.props.currentAnimalDisplay(response.data[0]);
					this.props.pageLoading(false);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	largImage = (img) => {
		this.props.displayLargeImage({
			display: 'block',
			img: `${img.URL}/${img.large}`,
			name: img.large,
		});
	};

	imageMap = () => {
		return this.props.moreImages.map((image) => {
			return (
				<div className="collections-images-image-box">
					<div className="collections-images-image-header">
						<span>Uploaded: {dayjs(image.date).format('MM/DD/YYYY')}</span>
					</div>
					<div className="collections-images-imgage-body">
						<img src={`${image.URL}/${image.thumbnail}`} alt={image.thumbnail} onClick={() => this.largImage(image)} />
					</div>
					<div className="collections-images-imgage-body-info">
						<p>Image Name: {image.large}</p>
					</div>
					<div className="collections-images-imgage-footer">
						<Button variant="danger" onClick={() => this.deleteImage(image)}>
							Delete
						</Button>
					</div>
				</div>
			);
		});
	};

	render() {
		return (
			<div className="collections-animal-more-images">
				<div>
					<p>
						You can add additional photos of your animal here. Either drag new images from a different folder and drop them into the drop box or click
						the drop box to select new images.
					</p>
				</div>
				<div>
					<ImageDrop imgDrop={{ className: 'collections-create-new-animal-img-drop' }} />
				</div>
				<div className="collections-create-new-animal-img-drop-button">
					<Button variant="success" disabled={!this.props.sendFiles.length} onClick={this.addImages}>
						Save
					</Button>
				</div>
				<div className="collections-animal-more-images-display">{this.imageMap()}</div>
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
	moreImages: state.viewAnimal.images,
	currentAnimal: state.viewAnimal,
	creatorId: state.user.uid,
	sendFiles: state.imageHandler.sendFiles,
	spinnerState: state.spinner.display,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Photos);
