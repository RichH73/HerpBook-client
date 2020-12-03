import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
// import _ from 'lodash';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import ReactQuill from 'react-quill';
// import DatePicker from 'react-datepicker';
// import dayjs from 'dayjs';
// import AlertModal from '../../../../../_services/Modal/Modal';
import NumberFormat from 'react-number-format';
import './CollectionList.css';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';

class CollectionList extends Component {
	state = {
		readOnly: true,
		modalIsOpen: true,
		disabled: false,
		display_weights: null,
	};

	toggle = () => {
		this.setState((state) => ({
			disabled: !state.disabled,
		}));
	};

	componentDidMount() {}

	onChangeHandler = (event) => {
		this.props.newListing([event.target.name], event.target.value);
	};

	handleChange = (value) => {
		this.props.editText({
			text: value,
		});
	};

	onChange = (e) => {
		e.preventDefault();
		if (this.state.display_weights === false) {
			this.setState({ display_weights: true });
			this.props.newListing(['display_weights'], true);
		}
		if (this.state.display_weights === true) {
			this.setState({ display_weights: false });
			this.props.newListing(['display_weights'], false);
		}
		console.log(this.state);
	};

	but = () => {
		console.log(this.state.display_weights);
	};

	// handleChange = (value) => {
	// 	this.props.animalUpdate({
	// 		comments: value,
	// 	});
	// };

	// dateHandler = (date) => {
	// 	this.props.animalUpdate({
	// 		dob: date,
	// 	});
	// };

	// onChangeHandler = (event) => {
	// 	this.props.animalUpdate({ [event.target.name]: event.target.value });
	// };

	// largImage = (img) => {
	// 	this.props.displayLargeImage({
	// 		display: 'block',
	// 		img: `${img.URL}/${img.large}`,
	// 		name: img.large,
	// 	});
	// };

	// showImage = (images) => {
	// 	const firstImg = _.first(images);
	// 	return (
	// 		<img src={`${_.get(firstImg, 'URL')}/${_.get(firstImg, 'thumbnail')}`} alt={_.get(firstImg, 'name')} onClick={() => this.largImage(firstImg)} />
	// 	);
	// };

	checkboxChangeHandler = (event) => {
		console.log(event.target.name);
		this.props.newListing([event.target.name]);
	};

	onSubmitHandler = () => {
		let listingInfo = {
			isCollection: true,
			collectionData: this.props.collection._id,
			creatorId: this.props.creatorId,
			created: new Date(),
			description: this.props.listDescription,
			user: this.props.username,
			category: this.props.collection.category,
			sub_category: this.props.collection.sub_category,
			//images: this.props.collection.images,
			businessFooter: '',
			...this.props.newLisingData,
		};
		this.props.modalSetState(true);
		setTimeout(() => {
			this.props.modalSetState(false);
		}, 2000);
		axios({
			method: 'post',
			url: `${this.props.API}/listings/list_collection`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: listingInfo,
		}).then((response) => {});
	};

	genderSelect = () => {
		switch (this.props.currentAnimal.gender) {
			case 'MALE':
				return (
					<select name="gender" onChange={this.onChangeHandler} disabled={this.state.readOnly}>
						<option selected value="MALE">
							Male
						</option>
						<option value="FEMALE">Female</option>
						<option value="UNKNOWN">Unknown</option>
					</select>
				);
			case 'FEMALE':
				return (
					<select name="gender" onChange={this.onChangeHandler} disabled={this.state.readOnly}>
						<option value="MALE">Male</option>
						<option selected value="FEMALE">
							Female
						</option>
						<option value="UNKNOWN">Unknown</option>
					</select>
				);
			case 'UNKNOWN':
				return (
					<select name="gender" onChange={this.onChangeHandler} disabled={this.state.readOnly}>
						<option value="MALE">Male</option>
						<option value="FEMALE">Female</option>
						<option selected value="UNKNOWN">
							Unknown
						</option>
					</select>
				);
			default:
				return (
					<select name="gender" onChange={this.onChangeHandler} disabled={this.state.readOnly}>
						<option value="MALE">Male</option>
						<option value="FEMALE">Female</option>
						<option selected value="UNKNOWN">
							Unknown
						</option>
					</select>
				);
		}
	};

	render() {
		const animal = this.props.collection;
		return (
			<div className="collection-to-classified">
				{!!animal.isClassified ? (
					<div>
						<h4>This animal is listed in classifieds</h4>
					</div>
				) : (
					''
				)}
				<div>
					<label>Title: </label>
					<input type="text" name="title" onChange={this.onChangeHandler} defaultValue={animal.classifiedData.title} />
				</div>
				<div>
					<label>Price: </label>
					<NumberFormat
						thousandSeparator={true}
						defaultValue={animal.classifiedData.price}
						allowNegative={false}
						prefix={'$'}
						decimalScale={2}
						fixedDecimalScale={2}
						onChange={this.onChangeHandler}
						name="price"
					/>
				</div>
				<div>
					<label>Display feed records: </label>
					<input
						type="checkbox"
						name="display_feedings"
						onChange={this.checkboxChangeHandler}
						defaultChecked={animal.classifiedData.display_feedings}
					/>
				</div>
				<div>
					<label>Display shed records: </label>
					<input
						type="checkbox"
						name="display_shedings"
						onChange={this.checkboxChangeHandler}
						defaultChecked={animal.classifiedData.display_sheddings}
					/>
				</div>
				<div>
					<label>Display pairing records: </label>
					<input
						type="checkbox"
						name="display_pairings"
						onChange={this.checkboxChangeHandler}
						defaultChecked={animal.classifiedData.display_pairings}
					/>
				</div>
				<div>
					<label>Display weight records: </label>
					<label>
						<Checkbox
							defaultChecked={this.props.collection.classifiedData.display_weights}
							name="display_weights"
							onChange={this.onChange}
							disabled={this.state.disabled}
						/>
						<button onClick={this.but}>state</button>
					</label>
					<input
						type="checkbox"
						name="display_weights"
						onChange={this.checkboxChangeHandler}
						defaultChecked={animal.classifiedData.display_weights}
					/>
				</div>
				<div>
					<ReactQuill
						style={{ backgroundColor: 'white', color: 'black' }}
						name="description"
						value={this.props.listDescription}
						onChange={this.handleChange}
						modules={this.props.mods.modules}
						formats={this.props.mods.formats}
						readOnly={false}
						theme="snow"
					/>
				</div>
				<button className="button" onClick={this.onSubmitHandler}>
					List
				</button>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	newLisingData: state.listing,
	category: state.listing.category,
	collection: state.viewAnimal,
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

export default connect(mapStateToProps, mapDispatchToProps)(CollectionList);
