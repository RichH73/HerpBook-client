import React, { Component } from 'react';
import './Profile.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import ReactQuill from 'react-quill';

class About extends Component {
	render() {
		const { first_name, last_name } = this.props;
		return (
			<div className="profile-about">
				<div>
					{first_name} {last_name}
				</div>
				<div>
					<ReactQuill style={{ width: '20%', marginTop: '4em' }} value={this.props.text} readOnly={true} theme="bubble" />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	uid: state.user_profile.uid,
	about: state.user_profile.about,
	profile_pic: state.user_profile.profile_pic,
	image: state.user_profile.image,
	username: state.user_profile.username,
	email: state.user_profile.email,
	first_name: state.user_profile.first_name,
	last_name: state.user_profile.last_name,
	street: state.user_profile.street,
	city: state.user_profile.city,
	state: state.user_profile.state,
	zip_code: state.user_profile.zip_code,
	website: state.user_profile.website,
	business_name: state.user_profile.business_name,
	text: state.richText.text,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
