import React from 'react';
import './CreateListing.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import Dropzone from 'react-dropzone';
//import ReactGA from 'react-ga';
import _ from 'lodash';
import Editor from '../../../_functions/Editor';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import ReactQuill from 'react-quill';

class CreateListing extends React.Component {
	state = {
		modal: 'none',
		button_disabled: true,
	};

	editorProps = {
		modules: {
			toolbar: [
				[{ header: [1, 2, false] }],
				['bold', 'italic', 'underline', 'strike', 'blockquote'],
				[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
				//['link', 'image', 'video'],
				['link'],
				['emoji'],
				//['clean'],
			],
			// 'emoji-toolbar': true,
			// 'emoji-textarea': false,
			// 'emoji-shortname': true,
		},
		formats: [
			'header',
			'bold',
			'italic',
			'underline',
			'strike',
			'blockquote',
			'list',
			'bullet',
			'indent',
			//'emoji',
			'link',
			'image',
			'video',
			'clean',
		],
		readOnly: false,
		type: 'write',
	};

	componentDidMount() {
		this.props.setPageTitle('Create Classified');
		//ReactGA.pageview('/create-listing');
	}

	componentWillUnmount() {
		this.props.clearListingData();
		this.props.clearRichText();
	}

	onChangeHandler = (event) => {
		this.props.newListing([event.target.name], event.target.value);
	};

	submitHandler = (event) => {
		event.preventDefault();
		this.props.pageLoading(true);
		// if(this.props.sendFiles < 1){
		//   alert('You must add at least one image.')
		// }
		// if(this.props.sendFiles > 0) {
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
			title: this.props.title,
			description: this.props.listDescription,
			price: this.props.price,
			gender: this.props.gender,
			shipping: this.props.shipping,
			category: this.props.category,
			sub_category: this.props.sub_category,
			user: this.props.username,
			weight: this.props.weight,
			images: images,
			businessFooter: !!this.props.userInfo.businessFooter ? this.props.userInfo.businessFooter : null,
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
		// }
	};

	handleChange = (value) => {
		this.props.editText({
			text: value,
		});
	};

	Modal = () => {
		return (
			<div className="create-classified-listing-modal" style={{ display: this.state.modal }}>
				<div>One or more of the files you are attempting to upload is too large. Please only upload files 3mb or less.</div>
				<div className="create-classified-listing-modal-button">
					<button onClick={this.closeModal}>Ok</button>
				</div>
			</div>
		);
	};

	closeModal = () => {
		this.setState({
			modal: 'none',
		});
	};

	disable_button = (bool) => {
		this.setState({
			button_disabled: bool,
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
		this.props.imageHandler({
			files: _.flatten([..._.get(this, 'props.images', []), newFile]),
			sendFiles: _.flatten([..._.get(this, 'props.sendFiles', []), saveFiles]),
			image_array: _.flatten([...(this, 'props.image_array', []), saveFiles]),
		});
	};

	clickHandler = (path) => {
		this.props.deleteImages(path);
	};

	SubCategoryMenu = (event) => {
		this.props.newListing([event.target.name], event.target.value);
	};

	category_menu = () => {
		if (this.props.categoryItems.length > 0) {
			return this.props.categoryItems.map((category) => (
				<option key={category.name} value={category.id}>
					{category.name}
				</option>
			));
		}
	};

	sub_category_menu = () => {
		return _.filter(this.props.sub_categoryItems, ['category_id', _.toNumber(this.props.category)]).map((sub) => (
			<option key={sub.name} value={sub.id}>
				{sub.name}
			</option>
		));
	};

	render() {
		return (
			<div>
				{/* <div className="posting-title">Create a classified listing</div> */}
				{/* <this.Modal /> */}
				<div className="posting-form">
					<div className="image-drop">
						<p>* Denotes required entires</p>
						<p>*Images (at least one image required)</p>
						<Dropzone accept="image/*" onDrop={this.onPreviewDrop} maxSize={50000000}>
							{({ getRootProps, getInputProps }) => (
								<section>
									<div className="create-classified-dropbox" {...getRootProps()}>
										<span>Please drag and drop your images into this box, or click the box to and them.</span>
										<input {...getInputProps()} />
									</div>
								</section>
							)}
						</Dropzone>
						{this.props.images.length > 0 && (
							<div id="image-preview">
								<h5>Image Preview</h5>
								<p>Click on an image to remove it.</p>
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

					<form onSubmit={this.submitHandler}>
						<label>* Title</label>
						<input
							type="text"
							name="title"
							maxLength="80"
							className="textinput textInput form-control create-listing-title"
							required
							onChange={this.onChangeHandler}
						/>

						<p>*Description (Please do not include url's in the description.)</p>
						{/* <Editor settings={{ ...this.editorProps.modules, ...this.editorProps.formats }} /> */}
						<ReactQuill
							style={{ backgroundColor: 'white', color: 'black' }}
							name="businessFooter"
							value={this.props.listDescription}
							onChange={this.handleChange}
							modules={this.props.mods.modules}
							formats={this.props.mods.formats}
							readOnly={false}
							theme="snow"
						/>
						<p>Weight (grams)</p>
						<input type="number" name="weight" step="0.01" className="numberinput form-control" id="id_weight" onChange={this.onChangeHandler} />
						<p>Gender</p>
						<select name="gender" onChange={this.onChangeHandler}>
							<option value="">Choose a gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Unknown">Unknown</option>
						</select>

						<p>Category</p>
						<select id="category" required name="category" onChange={this.onChangeHandler}>
							<option value="">Choose a category</option>
							{this.category_menu()}
						</select>

						{this.props.category > 0 ? (
							<div>
								<p>Sub category</p>
								<select id="sub-category" required name="sub_category" onChange={this.onChangeHandler}>
									<option value="">Choose a category</option>
									{this.sub_category_menu()}
								</select>
							</div>
						) : (
							''
						)}

						<p>* Price (If price includes shipping, please accounce that in the description.)</p>
						<input type="number" name="price" className="numberinput form-control" required id="id_price" onChange={this.onChangeHandler} />

						<p>Do you offer shipping?</p>
						<select required name="shipping" onChange={this.onChangeHandler}>
							<option value="false">No shipping</option>
							<option value="true">Sipping Available</option>
						</select>
						<br />
						<div id="button">
							<button type="submit" className="btn btn-success">
								Create
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	category: state.listing.category,
	categoryItems: state.categories.categories,
	creatorId: state.user.uid,
	description: state.listing.description,
	gender: state.listing.gender,
	image_array: state.imageHandler.image_array,
	images: state.imageHandler.images,
	imgs: state.imageHandler.image_array,
	listing: state.listing.images,
	listDescription: state.richText.text,
	picture: state.listing.picture,
	price: state.listing.price,
	sbnum: state.listing.category,
	sendFiles: state.imageHandler.sendFiles,
	API: state.config.server.serverAPI,
	shipping_cost: state.listing.shipping_cost,
	shipping: false,
	sub_categories: state.listing.sub_categories || [],
	sub_category: state.listing.sub_category,
	sub_categoryItems: state.categories.subCategories,
	submenu: state.categories.sub_categories || [],
	title: state.listing.title,
	token: state.user.token,
	user: state.user.username,
	userInfo: state.user,
	username: state.user.username,
	mods: state.richText.modules,
	weight: state.listing.weight,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateListing);
