import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import './About.css';
import axios from 'axios';
class About extends Component {
	state = {
		bio: '',
	};

	change_handler = (event) => {
		this.props.update_about({
			[event.target.name]: event.target.value,
		});
	};

	submit_handler = (event) => {
		event.preventDefault();
		axios({
			method: 'post',
			url: `${this.props.server_address}/users/update_about`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			},
			data: {
				about: this.props.about,
			},
		}).then((response) => {
			if (response.status === 201) {
				this.props.history.push({
					pathname: '/success/profileUpdate',
				});
			}
		});

		// let bio = this.refs.bio
		// bio.value = ''
	};

	componentDidMount() {
		axios({
			method: 'post',
			url: `${this.props.server_address}/users/about`,
			data: {
				uid: this.props.uid,
			},
		}).then((response) => {
			this.props.update_about(response.data);
		});
	}

	render() {
		return (
			<div className="edit-profile-about">
				<div>
					<p>Here you can display optional information about yourself and personal interestes in the Herp World.</p>
					<div>
						My Bio:
						<div className="bio-box">
							<textarea defaultValue={this.props.about} ref="bio" name="about" onChange={this.change_handler} onSubmit='value=""'></textarea>
						</div>
					</div>
					<button type="submit" className="btn btn-success" onClick={this.submit_handler}>
						Submit
					</button>
					{this.state.bio}
				</div>
				<div className="about-interests">My Interestes:</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		uid: state.user.uid,
		username: state.user.username,
		about: state.user.about,
		server_address: state.config.server_address,
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
