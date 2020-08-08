import React from 'react';
import './UpdateListing.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';

// const uid = localStorage.uid;

class CreateListing extends React.Component {
	async componentDidMount() {
		const subData = await fetch(`${this.props.server_address}/subCategories/`);
		const subs = await subData.json();
		const catData = await fetch(`${this.props.server_address}/categories/`);
		const cats = await catData.json();
		this.props.newListing('categories', cats);
		this.props.newListing('sub_categories', subs);
		axios({
			method: 'get',
			url: `${this.props.server_address}/classifieds/api/update/${this.props.match.params.id}/`,
			headers: {
				Authorization: 'token ' + localStorage.token,
			},
		}).then((res) => {
			this.props.newListing('price', res.data.price);
			this.props.newListing('title', res.data.title);
			this.props.newListing('description', res.data.description);
			this.props.newListing('shipping', res.data.shipping);
			this.props.newListing('picture', res.data.picture);
			if (res.data.picture_2) {
				this.props.newListing('picture_2', res.data.picture_2);
			}
			if (res.data.picture_3) {
				this.props.newListing('picture_3', res.data.picture_3);
			}
			if (res.data.picture_4) {
				this.props.newListing('picture_4', res.data.picture_4);
			}
		});
	}

	SubCategoryMenu = (event) => {
		this.props.newListing('sbnum', event.target.value);
		// eslint-disable-next-line
		var subs = this.props.sub_categories.filter((e) => e.category_id === event.target.value);
		var menulist = subs.map((sb) => <option value={sb.id}>{sb.name}</option>);
		var menu = (
			<select required name="sub_category" onClick={this.onChangeHandler}>
				<option value="">Choose a sub category</option>
				{menulist}
			</select>
		);
		this.props.newListing('submenu', menu);
		this.props.newListing('category', event.target.value);
	};

	onChangeHandler = (event) => {
		this.props.newListing(event.target.name, event.target.value);
	};
	fileChangeHandler = (event) => {
		// if (event.target.files[0].size > 800000) {
		// alert("File is too big! Please choose a file no larger than 800k.");
		// event.target.value = "";
		// return;
		// } else {
		this.props.newListing(event.target.name, event.target.files[0]);
		// }
	};
	submitHandler = (event) => {
		event.preventDefault();
		const listData = new FormData();
		listData.append('title', this.props.title);
		listData.append('shipping', this.props.shipping);
		listData.append('description', this.props.description);
		listData.append('price', this.props.price);
		listData.append('shipping', this.props.shipping);
		listData.append('category', this.props.category);
		listData.append('sub_category', this.props.sub_category);
		listData.append('picture', this.props.picture, this.props.picture.name);
		if (this.props.picture_2) {
			listData.append('picture_2', this.props.picture_2, this.props.picture_2.name);
		}
		if (this.props.picture_3) {
			listData.append('picture_3', this.props.picture_3, this.props.picture_3.name);
		}
		if (this.props.picture_4) {
			listData.append('picture_4', this.props.picture_4, this.props.picture_4.name);
		}

		axios({
			method: 'post',
			url: `${this.props.server_address}/classifieds/api/update/${this.props.params.match.id}/`,
			headers: {
				Authorization: 'token ' + localStorage.token,
			},
			data: listData,
		}).catch((err) => {
			console.log(err);
		});
	};

	render() {
		// const description = this.props.description;
		// eslint-disable-next-line
		// let categories = this.props.categories;
		const categoryItems =
			this.props.categories.length &&
			this.props.categories.map((category) => (
				<option key={category.name} value={category.id}>
					{category.name}
				</option>
			));
		// eslint-disable-next-line
		let sub_categories = this.props.sub_categories;
		// eslint-disable-next-line
		const sub_categoryItems =
			this.props.sub_categories.length &&
			this.props.sub_categories.map((sub_category) => (
				<option key={sub_category.name} value={sub_category.id}>
					{sub_category.name}
				</option>
			));
		return (
			<div id="listing-form" className="form-group">
				<form onSubmit={this.submitHandler} className="form-group">
					<fieldset className="form-group" />
					<legend className="border-bottom form_space">Create a classified listing</legend>

					<p>* Denotes required entires</p>

					<div id="div_id_title" className="form-group">
						<label id="id_title" className="col-form-label  requiredField">
							Title<span className="asteriskField">*</span>
						</label>
						<div className="form">
							<input
								type="text"
								name="title"
								maxLength="80"
								className="textinput textInput form-control"
								required
								defaultValue={this.props.title}
								id="id_title"
								onChange={this.onChangeHandler}
							/>
						</div>
					</div>

					<div id="div_id_description" className="form-group">
						<p>
							Current description:
							<br />
							{this.props.description}
						</p>
						<br />
						<label id="id_description" className="col-form-label  requiredField">
							Description
							<span className="asteriskField">* (Please do not include url's in the description.)</span>
						</label>

						<div className="form">
							<textarea
								name="description"
								cols="40"
								rows="10"
								className="textarea form-control"
								required
								id="id_description"
								onChange={this.onChangeHandler}
							></textarea>
						</div>
					</div>
					<div id="div_id_price" className="form-group">
						<label id="id_price" className="col-form-label  requiredField">
							Price
							<span className="asteriskField">* (If price includes shipping, please accounce that in the description.)</span>
						</label>
						<div className="form">
							<input
								type="number"
								name="price"
								step="0.01"
								className="numberinput form-control"
								required
								defaultValue={this.props.price}
								id="id_price"
								onChange={this.onChangeHandler}
							/>
						</div>
					</div>
					<div className="form-group">
						<div id="div_id_shipping" className="form-check">
							<label id="id_shipping" className="form-check-label">
								<p>Do you offer shipping?</p>
								<br />
							</label>
							<select required name="shipping" onChange={this.onChangeHandler}>
								<option value="false">No shipping</option>
								<option value="true">Sipping Available</option>
							</select>
						</div>
					</div>
					<div id="div_id_picture" className="form-group">
						<p>
							You must upload at least one picture for this classified listing. Up to 4 pictures total are allowed. Please do not upload any picutres
							larger than 800kb.
						</p>

						<label id="id_picture" className="col-form-label  requiredField">
							Picture<span className="asteriskField">*</span>
						</label>
						<div className="form">
							Currently set to: {this.props.picture}
							<img src={this.props.picture} width="100px" alt="" />
							<br />
							<input
								type="file"
								name="picture"
								accept="image/*"
								className="clearablefileinput"
								id="id_picture"
								required
								onChange={this.fileChangeHandler}
							/>
						</div>
					</div>
					<div id="div_id_picture_2" className="form-group">
						<label id="id_picture_2" className="col-form-label ">
							Picture 2
						</label>
						<div className="form">
							<input
								type="file"
								name="picture_2"
								accept="image/*"
								className="clearablefileinput"
								id="id_picture_2"
								onChange={this.fileChangeHandler}
							/>
						</div>
					</div>
					<div id="div_id_picture_3" className="form-group">
						<label id="id_picture_3" className="col-form-label ">
							Picture 3
						</label>
						<div className="form">
							<input
								type="file"
								name="picture_3"
								accept="image/*"
								className="clearablefileinput"
								id="id_picture_3"
								onChange={this.fileChangeHandler}
							/>
						</div>
					</div>
					<div id="div_id_picture_4" className="form-group">
						<label id="id_picture_4" className="col-form-label ">
							Picture 4
						</label>
						<div className="form">
							<input
								type="file"
								name="picture_4"
								accept="image/*"
								className="clearablefileinput"
								id="id_picture_4"
								onChange={this.fileChangeHandler}
							/>
						</div>
					</div>
					<div id="div_id_category" className="form-group">
						<label id="id_category" className="col-form-label  requiredField">
							Category<span className="asteriskField">*</span>
						</label>
						<div className="form">
							<select required name="category" onChange={this.SubCategoryMenu}>
								<option value="">Choose a category</option>
								{categoryItems}
							</select>
						</div>
					</div>
					<div id="div_id_sub_category" className="form-group">
						<label id="id_sub_category" className="col-form-label  requiredField">
							Sub category<span className="asteriskField">*</span>
						</label>
						<div className="form">{this.props.submenu}</div>
					</div>
					<button type="submit" className="btn btn-success">
						Save
					</button>
				</form>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		title: state.listing.title,
		description: state.listing.description,
		price: state.listing.price,
		shipping: false,
		category: state.listing.category,
		sub_category: state.listing.sub_category,
		picture: state.listing.picture,
		categories: state.listing.categories || [],
		sub_categories: state.listing.sub_categories || [],
		submenu: state.listing.submenu || [],
		server_address: state.config.server_address,
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateListing);
