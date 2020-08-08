import React from 'react';
//import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import './EditProfile.css';
import 'react-quill/dist/quill.snow.css';
//import Dropzone from 'react-dropzone';
import { get, forEach, first, flatten } from 'lodash';
import ReactQuill from 'react-quill';

class EditProfile extends React.Component {
	state = {
		pic_selected: false,
	};
	footerChangeHandler = (text) => {
		this.props.userInfoUpdate('businessFooter', text);
	};
	componentDidMount() {
		this.props.setPageTitle('My Profile');
	}
	pic_selected = () => {
		if (this.state.pic_selected === true) {
			this.setState({ pic_selected: false });
		} else {
			this.setState({ pic_selected: true });
		}
	};

	onChangeHandler = (event) => {
		this.props.userInfoUpdate(event.target.name, event.target.value);
	};

	fileChangeHandler = (event) => {
		this.setState({
			image: event.target.files[0],
		});
	};

	clickHandler = (path) => {
		this.props.deleteImages(path);
		this.setState({ pic_selected: false });
	};

	submitHandler = (event) => {
		event.preventDefault();
		let fileData = new FormData();
		const newUser = this.props.userObject;
		fileData.append('user', JSON.stringify(this.props.userObject));

		let imgFiles = this.props.sendFiles;
		forEach(imgFiles, function (file) {
			fileData.append('file', file);
		});

		this.props.liveProfileUpdate(fileData, this.props.history);
		/*
		axios({
			method: 'post',
			url: `${this.props.API}/users/update_profile`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
				uid: localStorage.uid,
				username: this.props.username,
				//enctype: "mylipart/form-data"
			},
			data: fileData,

			// data: {
			//   firstName: this.props.firstName,
			//   lastName: this.props.lastName,
			//   username: this.props.username,
			//   about: this.props.about,
			//   email: this.props.email,
			//   business_name: this.props.business_name,
			//   website: this.props.website,
			//   is_this_a_business: get(this, 'props.is_this_a_business', false),
			//   display_address: get(this, 'props.display_address', false),
			//   street: this.props.street,
			//   city: this.props.city,
			//   state: this.props.state,
			//   zip_code: this.props.zip_code,
			//   fileData: fileData
			// }
		})
			.then((response) => {
				if (response.status === 201) {
					this.props.imagesUploaded();
					const user = JSON.parse(atob(response.data.token.split('.')[1]));
					localStorage.setItem('token', get(response, 'data.token'));
					this.props.clear_profile();
					this.props.user_login(user);
					this.props.history.push({
						pathname: '/success/profileUpdate',
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
*/
	};

	onPreviewDrop = (files) => {
		const saveFiles = files.map((file) => file);
		const newFile = files.map((file) => ({
			lastModified: file.lastModified,
			__proto__: file.__proto__,
			name: file.name,
			path: file.path,
			size: file.size,
			type: file.type,
			webkitRelativePath: file.webkitRelativePath,
			length: file.length,
			preview: URL.createObjectURL(file),
			id: file.name,
		}));
		let load_new_file = first(newFile);
		let load_save_file = first(saveFiles);
		this.props.imageHandler({
			files: flatten([...get(this, 'props.images', []), load_new_file]),
			sendFiles: flatten([...get(this, 'props.sendFiles', []), load_save_file]),
			image_array: flatten([...(this, 'props.image_array', []), load_save_file]),
		});
		//this.props.newProfilePic(get(newFile, '0.name'));
	};

	state_selector = () => {
		return (
			<select name="state" onChange={this.onChangeHandler}>
				<option>{this.props.state}</option>
				{this.props.states.map((state) => (
					<option value={state}>{state}</option>
				))}
			</select>
		);
	};

	display_address = () => {
		const display_address_true = (
			<select name="display_address" onChange={this.onChangeHandler}>
				<option value={true}>Yes</option>
				<option value={false}>No</option>
			</select>
		);

		const display_address_false = (
			<select name="display_address" onChange={this.onChangeHandler}>
				<option value={false}>No</option>
				<option value={true}>Yes</option>
			</select>
		);

		return this.props.display_address === true ? display_address_true : display_address_false;
	};

	businessProfile = (user) => {
		return (
			<div className="edit-profile-form-business-info">
				<div className="edit-profile-form-businessName">
					<label>Business Name</label>
					<input
						type="text"
						name="businessName"
						value={user.businessName}
						maxLength="60"
						className="textinput textInput form-control"
						id="id_business_name"
						onChange={this.onChangeHandler}
					/>
				</div>
				<div className="edit-profile-form-businessPhone">
					<label>Business Phone: </label>
					<input
						type="text"
						name="businessPhone"
						value={user.businessPhone}
						maxLength="60"
						className="textinput textInput form-control"
						onChange={this.onChangeHandler}
					/>
				</div>
				<div className="edit-profile-form-businessWebsite">
					<label>Website: </label>
					<input type="url" name="website" value={user.website} maxLength="200" className="urlinput form-control" onChange={this.onChangeHandler} />
				</div>
				<div className="edit-profile-form-displayBusinessAddress">
					<label>Display Address?</label>
					{this.display_address()}
				</div>
				<div className="edit-profile-form-businessStreet">
					<label>Street</label>
					<input
						type="text"
						name="businessStreet"
						value={user.businessStreet}
						maxLength="60"
						className="textinput textInput form-control"
						onChange={this.onChangeHandler}
					/>
				</div>
				<div className="edit-profile-form-businessCity">
					<label>City</label>
					<input
						type="text"
						name="businessCity"
						value={user.businessCity}
						maxLength="20"
						className="textinput textInput form-control"
						onChange={this.onChangeHandler}
					/>
				</div>
				<div className="edit-profile-form-businessState">
					<label>State: </label>
					{this.state_selector()}
				</div>
				<div className="edit-profile-form-businessZip">
					<label>Zip Code: </label>
					<input
						type="text"
						name="businessZip"
						value={user.businessZip}
						maxLength="10"
						className="textinput textInput form-control"
						onChange={this.onChangeHandler}
					/>
				</div>
				<div className="edit-profile-form-businessFooter">
					<label>Add a footer to your classified ads.</label>
					<ReactQuill
						style={{ backgroundColor: 'white', color: 'black' }}
						name="businessFooter"
						value={user.businessFooter}
						onChange={this.footerChangeHandler}
						modules={this.props.mods.modules}
						formats={this.props.mods.formats}
						readOnly={false}
						theme="snow"
					/>
				</div>
			</div>
		);
	};

	render() {
		const { user } = this.props;

		const isBusiness = () => {
			const isBusiness_false = (
				<select name="isBusiness" onChange={this.onChangeHandler}>
					<option value={Boolean(false)}>No</option>
					<option value={Boolean(true)}>Yes</option>
				</select>
			);
			const isBusiness_true = (
				<select name="isBusiness" onChange={this.onChangeHandler}>
					<option value={Boolean(true)}>Yes</option>
					<option value={Boolean(false)}>No</option>
				</select>
			);
			return this.props.isBusiness === true ? isBusiness_true : isBusiness_false;
		};

		const display_entity_email = () => {
			const displayEntityEmailTrue = (
				<select name="displayEntityEmail" onChange={this.onChangeHandler}>
					<option value={Boolean(true)}>Yes</option>
					<option value={Boolean(false)}>No</option>
				</select>
			);
			const displayEntityEmailFalse = (
				<select name="displayEntityEmail" onChange={this.onChangeHandler}>
					<option value={Boolean(false)}>No</option>
					<option value={Boolean(true)}>Yes</option>
				</select>
			);
			return user.displayEntityEmail === true ? displayEntityEmailTrue : displayEntityEmailFalse;
		};

		const entity_email_type = (type) => {
			const entityEmailHome = (
				<select name="entityEmailType" onChange={this.onChangeHandler}>
					<option value="WORK">Work</option>
					<option value="HOME">Home</option>
				</select>
			);
			const entityEmailWork = (
				<select name="entityEmailType" onChange={this.onChangeHandler}>
					<option value="WORK">Work</option>
					<option value="HOME">Home</option>
				</select>
			);
			return entityEmailHome; //user.entityEmailType === 'HOME' ? entityEmailHome : entityEmailWork;
		};

		return (
			<div className="edit-profile-form">
				{/* <img src={`${this.props.USERSURL}/${user.username}/profile/${user.profile_pic}`} alt={this.props.profile_pic} /> */}
				{/* <Dropzone accept="image/*" onDrop={this.onPreviewDrop} maxSize={1242880}>
					{({ getRootProps, getInputProps }) => (
						<section>
							<div className="ropbox" {...getRootProps()}>
								{this.state.pic_selected ? '' : <p style={{ textAlign: 'center' }}>Change profile pic?</p>}
								<input {...getInputProps()} />
							</div>
						</section>
					)}
				</Dropzone> */}
				{this.props.images.length > 0 && (
					<div id="image-preview" style={{ textAlign: 'center' }}>
						<p>Preview, (click to remove).</p>
						{this.props.images.map((file) => (
							<img alt="Preview" key={file.preview} src={file.preview} onClick={() => this.clickHandler(file.path)} />
						))}
					</div>
				)}
				<div className="profile-image-edit-layer">Edit your photo</div>
				<br />
				<form onSubmit={this.submitHandler} className="profile-edit-form">
					<div className="edit-profile-entity-info">
						<div className="edit-profile-form-name-first">
							<label>First Name: </label>
							<input
								type="text"
								name="firstName"
								value={user.firstName}
								maxLength="60"
								className="textinput textInput form-control"
								id="firstName"
								onChange={this.onChangeHandler}
							/>
						</div>
						<div className="edit-profile-form-name-last">
							<label>Last Name: </label>
							<input
								type="text"
								name="lastName"
								value={user.lastName}
								maxLength="60"
								className="textinput textInput form-control"
								id="lastName"
								onChange={this.onChangeHandler}
							/>
						</div>
						<div className="edit-profile-form-entityEmail">
							<label>Email: </label>
							<input
								type="email"
								value={user.entityEmail}
								name="entityEmail"
								className="textinput textInput form-control"
								onChange={this.onChangeHandler}
							/>
						</div>
						<div className="edit-profile-form-display-entity-email">
							<label>Display Email Address: </label>
							{display_entity_email()}
						</div>
						<div className="edit-profile-form-entity-email-type">
							<label>Email Type: </label>
							{entity_email_type(user.entityEmailType)}
						</div>
						<div className="edit-profile-form-entity-phone-number">
							<label>Phone: </label>
							<input
								type="text"
								value={user.entityPhoneNumber}
								name="entityPhoneNumber"
								className="textinput textInput form-control"
								onChange={this.onChangeHandler}
							/>
						</div>
						<div className="edit-profile-form-display-entity-phone">
							<label>Display Phone Number: </label>
							<select>
								<option>No</option>
								<option>Yes</option>
							</select>
						</div>
						<div className="edit-profile-form-entity-phone-type">
							<label>Phone Type: </label>
							<select
								value={user.entityPhoneType}
								name="entityPhoneType"
								className="textinput textInput form-control"
								onChange={this.onChangeHandler}
							>
								<option value=""></option>
								<option value="MOBILE">Mobile</option>
								<option value="HOME">Home</option>
								<option value="WORK">Work</option>
							</select>
						</div>

						<div className="edit-profile-form-entity-street">
							<label>Street: </label>
							<input
								type="text"
								value={user.entityStreet}
								name="entityStreet"
								className="textinput textInput form-control"
								onChange={this.onChangeHandler}
							/>
						</div>
						<div className="edit-profile-form-entity-city">
							<label>City: </label>
							<input
								type="text"
								value={user.entityCity}
								name="entityCity"
								className="textinput textInput form-control"
								onChange={this.onChangeHandler}
							/>
						</div>
						<div className="edit-profile-form-entity-state">
							<label>State: </label>
							<input
								type="text"
								value={user.entityState}
								name="entityState"
								className="textinput textInput form-control"
								onChange={this.onChangeHandler}
							/>
						</div>
						<div className="edit-profile-form-entity-zip">
							<label>Zipcode: </label>
							<input
								type="entityZip"
								value={user.entityZip}
								name="entityZip"
								className="textinput textInput form-control"
								onChange={this.onChangeHandler}
							/>
						</div>
					</div>
					{!!user.is_this_a_business ? this.businessProfile(user) : ''}
					<div className="edit-profile-form-button">
						<button type="submit" className="btn btn-success">
							Save Profile
						</button>
					</div>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		firstName: state.user.firstName,
		lastName: state.user.lastName,
		loggedInUser: state.userLoggedIn,
		email: state.user.email,
		username: state.user.username,
		about: state.user.about,
		profile_pic: state.user.profile_pic,
		sendFiles: state.imageHandler.sendFiles,
		image_array: state.imageHandler.image_array,
		last_login: state.user.last_login,
		uid: state.user.uid,
		is_this_a_business: state.user.is_this_a_business,
		business_name: state.user.business_name,
		display_address: state.user.display_address,
		street: get(state, 'user.street'),
		city: get(state, 'user.city', ''),
		state: get(state, 'user.state'),
		zip_code: get(state, 'user.zip_code'),
		phoneNumber: state.user.phoneNumber,
		displayPhoneNumber: state.user.displayPhoneNumber,
		phoneType: state.user.phoneType,
		phone_number: state.user.phone_number,
		website: state.user.website,
		images: state.imageHandler.images,
		API: state.config.server.serverAPI,
		USERSURL: state.config.server.usersURL,
		states: state.states,
		userObject: state.user,
		mods: state.richText,
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
