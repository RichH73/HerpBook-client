import React, { Component } from 'react';
import './PublicProfile.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import About from './About/About';
import Profile from './Profile/Profile';
import Images from './Images/Images';

class PublicProfile extends Component {
	state = {
		page: <About />,
	};
	componentDidMount() {
		//this.props.get_user({uid: list.username})
		//this.props.get_user_posts({uid: this.props.uid})
		this.props.get_user_pictures(this.props.username);
	}

	display_content = (event) => {
		if (event === 'about') {
			this.setState({
				page: <About />,
			});
		} else if (event === 'profile') {
			this.setState({
				page: <Profile />,
			});
		} else if (event === 'images') {
			this.setState({
				page: <Images />,
			});
		}
	};

	componentWillUnmount() {
		this.props.clear_user();
	}

	render() {
		const { imageGalleries, collections } = this.props.modules;
		// Check to see if we have recieved a username to lookup
		// and fetch that username. If no user is in redux and
		// no props have been passed we fetch our own profile.
		const { profile_pic, username, my_username } = this.props;
		if (this.props.location.profile) {
			let user = this.props.location.profile.uid;
			this.props.get_user({ uid: user });
		}
		if (!this.props.location.profile && username === '') {
			this.props.get_user({ uid: my_username });
		}
		return (
			<div className="public-profile-body">
				<div className="public-profile-header">
					<div className="public-profile-image">
						{username !== '' ? <img src={`${this.props.USERSURL}/${username}/profile/${profile_pic}`} alt="Profile Pic" /> : ''}
					</div>
					<div className="public-profile-navbar">
						<div>
							<div className="public-profile-link" onClick={() => this.display_content('about')}>
								About
							</div>
						</div>
						<div>
							<div className="public-profile-link" onClick={() => this.display_content('profile')}>
								Profile
							</div>
						</div>
						{imageGalleries ? (
							<div>
								<div className="public-profile-link" onClick={() => this.display_content('images')}>
									Images
								</div>
							</div>
						) : (
							''
						)}
					</div>
				</div>

				<div className="public-profile-container">{this.state.page}</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	my_username: state.user.username,
	my_uid: state.user.uid,
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
	modules: state.config.modules,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicProfile);
