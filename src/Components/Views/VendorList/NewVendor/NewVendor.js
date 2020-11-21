import React, { Component } from 'react';
import './NewVendor.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import axios from 'axios';
import { get, toNumber, filter } from 'lodash';
import Recaptcha from 'react-recaptcha';

class NewVendor extends Component {
	state = {
		business_name: '',
		projects: [],
		website: '',
		about: '',
		email: '',
		phone: '',
		zip_code: '',
		isVerified: false,
	};

	change_handler = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	submit_handler = (event) => {
		//if (this.state.isVerified) {
		event.preventDefault();
		axios({
			method: 'post',
			url: `${this.props.API}/breeders/new_breeder`,
			data: this.state,
		}).then((response) => {
			if (response.status === 201) {
				this.props.history.push('/success/new_breeder');
			}
		});
		//}
	};

	breeder_projects = (event) => {
		event.preventDefault();
	};

	// add_categories = () => {
	//     let subs = get(this.props, 'sub_categories')
	// }

	category_menu = () => {
		return this.props.categoryItems.map((category) => (
			<option key={category.name} value={category.id}>
				{category.name}
			</option>
		));
	};

	sub_category_menu = () => {
		return filter(this.props.sub_categoryItems, ['category_id', toNumber(this.props.category)]).map((sub) => (
			<option key={sub.name} value={sub.name}>
				{sub.name}
			</option>
		));
	};

	onChangeHandler = (event) => {
		this.props.newListing([event.target.name], event.target.value);
	};

	project_remove = (event) => {
		// let new_projects = this.state.projects
		// const filtered =
		this.setState({
			projects: this.state.projects.filter((project) => project !== event),
		});
	};

	add_project = (event) => {
		event.preventDefault();
		this.setState({
			projects: [...this.state.projects, this.state.project_to_add],
		});
	};

	verifyCallback = (response) => {
		if (response) {
			this.setState({
				isVerified: true,
			});
		}
	};

	render() {
		return (
			<div className="new-vendor-add-form">
				<p id="opening-paragraph">
					Thank you for taking the time to add to the breeders list. Please fill in the form below then click submit. Once we have had the time to
					verify the addition it will be added to the list.
				</p>
				<form onSubmit={this.submit_handler}>
					<div className="new-vendor-breeding-projects">
						<p id="new-vendor-specialties-paragraph">Select animals bred and or items sold from the following drop down boxes.</p>
						<div>
							{get(this.state, 'projects').length > 0 ? 'Specialties: (Click an item to remove it.)' : ''}
							{get(this.state, 'projects', []).map((project) => (
								<div onClick={() => this.project_remove(project)}>
									<b>{project}</b>
								</div>
							))}
						</div>
					</div>

					<div className="new-vendor-add-projects">
						<span>
							<label className="new-vendor-input-form-element-label">Select a Category</label>
						</span>
						<div>
							<select id="category" required name="category" onChange={this.onChangeHandler}>
								<option value="">Choose a category</option>
								{this.category_menu()}
							</select>
						</div>
						{this.props.category > 0 ? (
							<div>
								<label className="new-vendor-input-form-element-label">Select a Sub-category</label>
								<div>
									<select id="new-vendor-sub-category" required name="project_to_add" onChange={this.change_handler}>
										<option value="">Choose a category</option>
										{this.sub_category_menu()}
									</select>
								</div>
							</div>
						) : (
							''
						)}
						<br />
						<button onClick={this.add_project}>add</button>
					</div>
					<div className="new-vendor-input-form-element">
						<label className="new-vendor-input-form-element-label">Business Name: </label>
						<input type="text" name="business_name" onChange={this.change_handler} />
					</div>
					<div className="new-vendor-input-form-element">
						<label className="new-vendor-input-form-element-label">Website: </label>
						<input type="url" name="website" onChange={this.change_handler} />
					</div>
					<div className="new-vendor-input-form-element">
						<label className="new-vendor-input-form-element-label">Phone Number: </label>
						<input type="text" name="phone" onChange={this.change_handler} />
					</div>
					<div className="new-vendor-input-form-element">
						<label className="new-vendor-input-form-element-label">Email Address: </label>
						<input type="email" name="email" onChange={this.change_handler} />
					</div>
					<div className="new-vendor-input-form-element">
						<label className="new-vendor-input-form-element-label">State: </label>
						<select name="state" onChange={this.change_handler}>
							<option></option>
							{this.props.states.map((state) => (
								<option>{state}</option>
							))}
						</select>
					</div>
					<div className="new-vendor-input-form-element">
						<label className="new-vendor-input-form-element-label">Zip Code: </label>
						<input type="text" name="zip_code" onChange={this.change_handler} />
					</div>
					<div className="add-about">
						<label className="new-vendor-input-form-element-label">You can provide any extra information about his vendor here.</label>
						<textarea name="about" onChange={this.change_handler}></textarea>
					</div>
					<div className="new-vendor-recaptcha">
						<Recaptcha sitekey="6LfD67sZAAAAAFTIPvukDoapHz02ZWtm9B5u0NE8" render="explicit" verifyCallback={this.verifyCallback} />
					</div>

					<button type="submit" className="btn btn-success">
						Submit
					</button>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	uid: state.user.uid,
	categoryItems: state.categories.categories,
	category: state.listing.category,
	sub_categoryItems: state.categories.subCategories,
	sub_categories: state.categories.subcategories,
	states: state.states,
	API: state.config.server.serverAPI,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewVendor);
