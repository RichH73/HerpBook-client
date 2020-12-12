import React from 'react';
import './CreateListing.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import Dropzone from 'react-dropzone';
//import ReactGA from 'react-ga';
import _ from 'lodash';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import ReactQuill from 'react-quill';
import NumberFormat from 'react-number-format';

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
		//ReactGA.pageview('/create-classified');
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
			created: new Date(),
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

	handleChange = (value) => {
		this.props.editText({
			text: value,
		});
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

	weightSelect = () => {
		return (
			<select name="weightUnit" onChange={this.onChangeHandler}>
				<option>Unit</option>
				<option value="gm">gm</option>
				<option value="kg">kg</option>
				<option value="oz">oz</option>
				<option value="lb">lb</option>
			</select>
		);
	};

	shippingPrice = (
		<div className="create-classified-shipping-price" style={{ margin: '1em auto' }}>
			<label className="field-input-label">Flat Rate Shipping Cost: </label>
			<NumberFormat
				thousandSeparator={true}
				placeholder={'Leave blank if calculated'}
				allowNegative={false}
				prefix={'$'}
				decimalScale={2}
				fixedDecimalScale={2}
				onChange={this.onChangeHandler}
				name="shippingPrice"
			/>
		</div>
	);

	render() {
		return (
			<div className="create-classified-form">
				<div className="image-drop">
					<label className="field-input-label">* Denotes required entires</label>
					<label className="field-input-label">*Images (at least one image required)</label>
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

				<form onSubmit={this.submitHandler}>
					<div className="create-classified-form-inputs">
						<div className="create-classified-title">
							<label className="field-input-label">* Title: </label>
							<input
								type="text"
								name="title"
								maxLength="80"
								className="textinput textInput form-control create-classified-title"
								required
								onChange={this.onChangeHandler}
							/>
						</div>
						<div className="create-classified-price">
							<label className="field-input-label">*Price: </label>
							<NumberFormat
								thousandSeparator={true}
								placeholder={this.props.price}
								allowNegative={false}
								prefix={'$'}
								decimalScale={2}
								fixedDecimalScale={2}
								onChange={this.onChangeHandler}
								name="price"
							/>
						</div>
						<div className="create-classified-weight">
							<label className="field-input-label">Weight: </label>
							<input type="number" name="weight" step="0.1" className="numberinput form-control" id="id_weight" onChange={this.onChangeHandler} />
							{!!this.props.weight ? <this.weightSelect /> : ''}
						</div>
						<div className="create-classified-list-id">
							<label className="field-input-label">ID: </label>
							<input type="text" name="userListId" onChange={this.onChangeHandler} />
						</div>
						<div className="create-classified-gender">
							<label className="field-input-label">Gender: </label>
							<select name="gender" onChange={this.onChangeHandler}>
								<option value="">Choose a gender</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Unknown">Unknown</option>
							</select>
						</div>

						<div className="create-classified-category">
							<label className="field-input-label">Category</label>
							<select id="category" required name="category" onChange={this.onChangeHandler}>
								<option value="">Choose a category</option>
								{this.category_menu()}
							</select>
						</div>

						{!!this.props.category ? (
							<div className="create-classified-sub-category">
								<label className="field-input-label">Sub category</label>
								<select id="sub-category" required name="sub_category" onChange={this.onChangeHandler}>
									<option value="">Choose a category</option>
									{this.sub_category_menu()}
								</select>
							</div>
						) : (
							''
						)}
						<div className="create-classified-shipping">
							<label className="field-input-label">Do you offer shipping? </label>
							<select required name="shipping" onChange={this.onChangeHandler}>
								<option selected value="false">
									No shipping
								</option>
								<option value="true">Shipping Available</option>
							</select>
							{!!this.props.newLisingData.shipping ? this.shippingPrice : ''}
						</div>
						<div className="create-classified-description">
							<div className="create-classified-description-label">
								<label className="field-input-label">*Description.</label>
							</div>
							<div className="create-classified-description-editor">
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
							</div>
						</div>
						<div className="create-classified-submit-button">
							<button type="submit" className="btn btn-success">
								Create Classified
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	newLisingData: state.listing,
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
