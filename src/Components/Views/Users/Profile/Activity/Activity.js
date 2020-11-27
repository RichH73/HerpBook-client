import React, { Component } from 'react';
import './Activity.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import axios from 'axios';
import _ from 'lodash';
//TODO remvoe date-and-time
import date from 'date-and-time';

const date_format = 'ddd, MMM DD YYYY h:mm:ss A';
class Activity extends Component {
	state = {};

	onChangeHandler = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	commentBoxSubmit = (event) => {
		if (event.key === 'Enter') {
		}
	};

	onSubmitHandler = (event) => {
		axios({
			method: 'post',
			url: `${this.props.server_address}/posts/post`,
			headers: {
				uid: localStorage.uid,
				token: localStorage.token,
			},
			data: {
				post: this.state.body,
				uid: localStorage.uid,
				username: this.props.username,
				title: 'A new post',
				date: new Date(),
			},
		});
		//this.props.get_user_posts({uid: this.props.uid})
	};

	componentDidMount() {
		//this.props.get_user_posts({uid: this.props.uid})
	}

	render() {
		return (
			<div className="profile-activity">
				<p>{this.state.comment_box}</p>
				<p>Post</p>
				<textarea className="post-message-box" name="body" onChange={this.onChangeHandler}></textarea>
				<div className="btn-box">
					<button onClick={this.onSubmitHandler} className="btn btn-success">
						Send
					</button>
				</div>

				{_.get(this, 'props.posts').map((post) => (
					<div className="user-posts">
						<div className="post-date">{date.format(new Date(post.date), date_format)}</div>
						<div className="post-body">{_.get(post, 'body')}</div>
						<div className="post-image">
							<img src={_.get(this, 'props.image')} alt="" />
						</div>
						<div className="post-toolbar" onClick={this.commentChanger}>
							Comments
						</div>
						<div className="post-comment">
							<input
								type="text"
								autoComplete="off"
								name={`user-comment-box-${post._id}`}
								placeholder="Leave a comment"
								onKeyDown={this.commentBoxSubmit}
							/>
						</div>
						<div className="post-linesaver"></div>
						<div className="post-user">{`${_.get(this, 'props.first_name')} ${_.get(this, 'props.last_name')}`}</div>
					</div>
				))}
			</div>
		);
	}
}
//TODO if this is used, add API and SERVER adresses
const mapStateToProps = (state) => ({
	uid: state.user_profile.uid,
	about: state.user_profile.about,
	profileImage: state.user_profile.image,
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
	posts: state.user_posts.posts || [],
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
