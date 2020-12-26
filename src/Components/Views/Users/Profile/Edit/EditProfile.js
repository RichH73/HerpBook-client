import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import './EditProfile.css';
import 'react-quill/dist/quill.snow.css';
//import Dropzone from 'react-dropzone';
import { get, forEach, first, flatten } from 'lodash';
import ReactQuill from 'react-quill';
import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
//import { Base64 } from 'js-base64';

// Bootstrap imports
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Toast from 'react-bootstrap/Toast';

class EditProfile extends React.Component {
	state = {
		pic_selected: false,
		updateToast: false,
	};

	componentDidMount() {
		const { uid } = this.props.userInfo;
		this.props.setPageTitle('My Profile');
		this.props.getMyProfile(uid);
	}

	footerChangeHandler = (text) => {
		this.props.userInfoUpdate('businessFooter', text);
	};
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
		//const newUser = this.props.userObject;
		fileData.append('user', JSON.stringify(this.props.userObject));

		let imgFiles = this.props.sendFiles;
		forEach(imgFiles, function (file) {
			fileData.append('file', file);
		});

		//this.props.liveProfileUpdate(fileData, this.props.history);
		axios({
			method: 'post',
			url: `${this.props.API}/users/update_profile`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
				uid: localStorage.uid,
				username: this.props.username,
			},
			data: fileData,
		})
			.then((response) => {
				if (response.status === 201) {
					this.setState({ updateToast: true });
					// this.setState({ modalIsOpen: true });
					// setTimeout(() => {
					// 	this.setState({
					// 		modalIsOpen: false,
					// 	});
					// }, 2000);
					//this.props.imagesUploaded();
					//const user = JSON.parse(Base64.decode(response.data.token.split('.')[1]));
					localStorage.setItem('token', get(response, 'data.token'));
					//this.props.clear_profile();
					this.props.user_login(response.data.user);
					// this.props.history.push({
					// 	pathname: '/success/profileUpdate',
					// });
				}
			})
			.catch((err) => {
				console.log(err);
			});
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

	displayBusinessOnClassifieds = (event) => {
		console.log({ [event.target.name]: event.target.value });
		if (!!this.props.userInfo.display_address) {
			this.props.userInfoUpdate('display_address', false);
		}
		if (!this.props.userInfo.display_address) {
			this.props.userInfoUpdate('display_address', true);
		}
	};

	businessProfile = (user) => {
		return (
			<div className="edit-profile-business-info">
				<React.Fragment>
					<div className="edit-profile-business-title">
						<h4>Business Information</h4>
					</div>

					<Form onSubmit={this.submitHandler}>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Business Name</Form.Label>
								<Form.Control type="text" name="businessName" value={user.businessName} maxLength="30" onChange={this.onChangeHandler} />
							</Form.Group>
						</Form.Row>

						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Phone</Form.Label>
								<NumberFormat
									format="+1 (###) ###-####"
									className="textInput form-control"
									allowEmptyFormatting
									mask="_"
									defaultValue={user.businessPhone}
									onChange={this.onChangeHandler}
									name="businessPhone"
								/>
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" value={user.businessEmail} name="businessEmail" onChange={this.onChangeHandler} />
							</Form.Group>
						</Form.Row>

						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Address</Form.Label>
								<Form.Control
									type="text"
									value={user.businessStreet}
									name="businessStreet"
									className="textinput textInput form-control"
									onChange={this.onChangeHandler}
								/>
							</Form.Group>
						</Form.Row>

						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>City</Form.Label>
								<Form.Control
									type="text"
									value={user.businessCity}
									name="businessCity"
									className="textinput textInput form-control"
									onChange={this.onChangeHandler}
								/>
							</Form.Group>
							<Form.Group as={Col}>
								<Form.Label>State</Form.Label>
								<Form.Control as="select" name="businessState" onChange={this.onChangeHandler} value={user.businessState}>
									{this.props.states.map((state) => (
										<option value={state}>{state}</option>
									))}
								</Form.Control>
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label size="md">Zipcode</Form.Label>
								{/* <Form.Control name="entityZip" value={user.entityZip} onChange={this.onChangeHandler} size='md' /> */}
								<NumberFormat
									maxLength="5"
									allowEmptyFormatting
									value={user.businessZip}
									onChange={this.onChangeHandler}
									className="textInput form-control"
									name="businessZip"
									size="md"
								/>
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Website</Form.Label>
								<Form.Control type="url" value={user.website} name="website" onChange={this.onChangeHandler} />
							</Form.Group>
						</Form.Row>

						<Form.Row>
							<Form.Check
								type="switch"
								checked={this.props.userInfo.display_address}
								className="edit-profile-switch-input"
								id="custom-switch"
								name="mySwitch"
								label="Display business address on classified ads"
								onChange={this.displayBusinessOnClassifieds}
							/>
						</Form.Row>
					</Form>
					<div className="edit-profile-business-footer">
						<Form.Label>Add a footer to your classified ads.</Form.Label>
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
				</React.Fragment>
			</div>
		);
	};

	render() {
		const setShow = () => {
			this.setState({ updateToast: false });
		};
		const { user } = this.props;
		return (
			<div className="profile-edit-form-main">
				<Toast
					show={this.state.updateToast}
					onClose={() => setShow(false)}
					delay={3000}
					autohide
					animation
					style={{ position: 'sticky', zIndex: '2', top: '20%', left: '30%', border: '6px solid lime' }}>
					<Toast.Header>
						<strong>Success!</strong>
					</Toast.Header>
					<Toast.Body>Profile Successfully Updated!</Toast.Body>
				</Toast>
				<div className="profile-edit-personal-info">
					<div className="edit-profile-entity-title">
						<h4>Personal Information</h4>
					</div>
					<Form onSubmit={this.submitHandler}>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label size="md">First Name</Form.Label>
								<Form.Control type="text" name="firstName" value={user.firstName} maxLength="20" onChange={this.onChangeHandler} size="md" />
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label size="md">Last Name</Form.Label>
								<Form.Control type="text" name="lastName" value={user.lastName} maxLength="20" onChange={this.onChangeHandler} size="md" />
							</Form.Group>
						</Form.Row>

						{window.innerWidth > 800 ? (
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>Phone</Form.Label>
									<InputGroup>
										<NumberFormat
											format="+1 (###) ###-####"
											className="textInput form-control"
											allowEmptyFormatting
											mask="_"
											defaultValue={user.entityPhoneNumber}
											onChange={this.onChangeHandler}
											name="entityPhoneNumber"
											style={{ width: '40%' }}
										/>
										<Form.Control as="select" name="entityPhoneType" onChange={this.onChangeHandler} value={user.entityPhoneType} size="md">
											<option value="MOBILE">MOBILE</option>
											<option value="HOME">HOME</option>
											<option value="WORK">WORK</option>
										</Form.Control>
									</InputGroup>
								</Form.Group>

								<Form.Group as={Col}>
									<Form.Label>Email</Form.Label>
									<InputGroup>
										<Form.Control type="email" value={user.entityEmail} name="entityEmail" onChange={this.onChangeHandler} style={{ width: '40%' }} />
										<Form.Control as="select" name="entityEmailType" onChange={this.onChangeHandler} value={user.entityEmailType} size="md">
											<option value="HOME">HOME</option>
											<option value="WORK">WORK</option>
										</Form.Control>
									</InputGroup>
								</Form.Group>
							</Form.Row>
						) : (
							<React.Fragment>
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Phone</Form.Label>
										<InputGroup>
											<NumberFormat
												format="+1 (###) ###-####"
												className="textInput form-control"
												allowEmptyFormatting
												mask="_"
												defaultValue={user.entityPhoneNumber}
												onChange={this.onChangeHandler}
												name="entityPhoneNumber"
												style={{ width: '40%' }}
											/>
											<Form.Control as="select" name="entityPhoneType" onChange={this.onChangeHandler} value={user.entityPhoneType} size="md">
												<option value="MOBILE">MOBILE</option>
												<option value="HOME">HOME</option>
												<option value="WORK">WORK</option>
											</Form.Control>
										</InputGroup>
									</Form.Group>
								</Form.Row>

								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Email</Form.Label>
										<InputGroup>
											<Form.Control
												type="email"
												value={user.entityEmail}
												name="entityEmail"
												onChange={this.onChangeHandler}
												style={{ width: '40%' }}
											/>
											<Form.Control as="select" name="entityEmailType" onChange={this.onChangeHandler} value={user.entityEmailType} size="md">
												<option value="HOME">HOME</option>
												<option value="WORK">WORK</option>
											</Form.Control>
										</InputGroup>
									</Form.Group>
								</Form.Row>
							</React.Fragment>
						)}
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Address</Form.Label>
								<Form.Control type="text" value={user.entityStreet} name="entityStreet" onChange={this.onChangeHandler} />
							</Form.Group>
						</Form.Row>

						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>City</Form.Label>
								<Form.Control type="text" value={user.entityCity} name="entityCity" onChange={this.onChangeHandler} />
							</Form.Group>
							<Form.Group as={Col}>
								<Form.Label>State</Form.Label>
								<Form.Control as="select" name="entityState" onChange={this.onChangeHandler} value={user.entityState}>
									{this.props.states.map((state) => (
										<option value={state}>{state}</option>
									))}
								</Form.Control>
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label>Zipcode</Form.Label>
								{/* <Form.Control name="entityZip" value={user.entityZip} onChange={this.onChangeHandler} size='md' /> */}
								<NumberFormat
									maxLength="5"
									className="textInput form-control"
									allowEmptyFormatting
									value={user.entityZip}
									onChange={this.onChangeHandler}
									name="entityZip"
								/>
							</Form.Group>
						</Form.Row>
					</Form>
				</div>

				{!!user.is_this_a_business ? this.businessProfile(user) : ''}
				<div className="edit-profile-submit-button">
					<Button variant="success" onClick={this.submitHandler}>
						Save Profile
					</Button>
				</div>
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
		userInfo: state.user,
		mods: state.richText,
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
