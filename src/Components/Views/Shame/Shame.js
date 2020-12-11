import './Shame.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import React, { Component } from 'react';
import { get } from 'lodash';
import axios from 'axios';
//import ReactQuill from 'react-quill';
import { Link } from 'react-router-dom';
//import ReactGA from "react-ga";

class Shame extends Component {
	state = {
		styles: {
			zIndex: 300,
			width: '100%',
			height: '100%',
			backgroundColor: 'white',
			position: 'relative',
			left: 0,
			top: 0,
			display: 'none',
		},
		image: {
			name: '',
			address: '',
		},
	};
	componentDidMount() {
		this.props.setPageTitle('Wall of Shame');
		//ReactGA.pageview("/welcome");
		axios({
			method: 'get',
			url: `${this.props.API}/shame/`,
		}).then((response) => {
			this.props.newShames(response.data);
		});
	}

	imgFloatingDiv = (image) => {
		const imgAddress = `https://www.herpbook.com/wall_of_shame/${image}`;
		this.props.newFloatingImage(imgAddress);
	};

	hideFloatingImage = () => {
		this.props.hideFloatingImage();
	};

	displayImages = (imgs) => {
		return imgs.map((image) => (
			<div className="wall-of-shame-images">
				<img src={`https://www.herpbook.com/wall_of_shame/${image}`} onClick={() => this.imgFloatingDiv(image)} alt={image} />
			</div>
		));
	};

	submitHandler = (data) => {
		const { uid, username, first_name, last_name } = this.props.user;
		let commentData = {
			reportId: get(data, '_id'),
			uid: uid,
			username: username,
			firstName: first_name,
			lastName: last_name,
			comment: this.props.comment,
		};
		this.props.shameReportComment(commentData);
	};

	leaveCommentBox = (props) => {
		if (this.props.registeredUser) {
			return (
				<div className="wall-of-shame-user-report-leave-comment">
					<label className="field-input-label">Leave a comment:</label>
					<div>
						<input type="text" name="newComment" onChange={this.onChangeHandler} />
						<button onClick={() => this.submitHandler(props)}>Submit</button>
					</div>
				</div>
			);
		}
		return <div className="wall-of-shame-user-report-leave-comment">Log in to leave a comment</div>;
	};

	user_reports = () => {
		return this.props.shames.map((report) => (
			<div className="wall-of-shame-user-reports">
				<div className="wall-of-shame-user-report">
					<div className="wall-of-shame-user-reports-business-name">
						<h3>{report.business_name}</h3>
					</div>
					<div className="wall-of-shame-user-reports-business-name">
						<h3>
							<Link to={{ pathname: '/view_shame', reportId: report._id }}>{report.business_name}</Link>
						</h3>
					</div>

					<div className="wall-of-shame-user-reports-business-owner-name">
						<label className="wall-of-shame-user-reports-label">Business Owners Name:</label>
						<div className="wall-of-shame-user-reports-business-owner wall-of-shame-attribute">{report.business_owner}</div>
					</div>

					<div className="wall-of-shame-user-reports-website">
						<label className="wall-of-shame-user-reports-label">Website URL:</label>
						<div className="wall-of-shame-attribute">{report.business_website}</div>
					</div>

					<div className="wall-of-shame-user-reports-email">
						<label className="wall-of-shame-user-reports-label">Email Address:</label>
						<div className="wall-of-shame-attribute">{report.business_email}</div>
					</div>

					<div className="wall-of-shame-user-reports-business-phone-number">
						<label className="wall-of-shame-user-reports-label">Phone Number:</label>
						<div className="wall-of-shame-attribute">{report.business_phone}</div>
					</div>

					{/* <div><Link to={{pathname: '/view_shame', reportId: report._id}}>See full report</Link></div> */}
				</div>
			</div>
		));
	};

	commentMapper = (comments) => {
		return comments.map((comment) => (
			<React.Fragment>
				<div className="wall-of-shame-user-report-comment">
					{comment.username} <small>{comment.date}</small>
					<br />
					{comment.comment}
				</div>
			</React.Fragment>
		));
	};

	onChangeHandler = (event, report) => {
		event.preventDefault();
		this.props.fileNewReport([event.target.name], event.target.value);
		this.props.fileNewReport('testing', report);
	};

	render() {
		return (
			<React.Fragment>
				<div style={this.state.styles} onClick={this.hideFloatingImage}>
					Hello world
				</div>
				<div>
					<div className="wall-of-shame-header">
						<h3>Wall of Shame</h3>
					</div>
					<div className="wall-of-shame-disclaimer">
						<p>
							The following reports are posted by individual users of HerpBook.com. Any views and opinions represented belong solely to the user and
							are not the views or opinions of HerpBook. HerpBook reserves the right to remove any report for any reason at any time. Reported
							business owners have the right to dispute the report with documentation and or personal resolution with the reporting user.
						</p>
						<p>
							Profanity, pornography, threats, hateful speech and racist comments will not be tolerated. Posting any such content will result in the
							post of comment to be removed and the user account may be deleted from HerpBook as well. We reserve the right to remove any report or
							comment for any reason.
						</p>
					</div>
					<div className="wall-of-shame-file-report">
						<Link to="/file_report">File a report by click here.</Link>
					</div>
				</div>
				<this.user_reports />
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	displayFloatingImage: state.floatingImage,
	API: state.config.server.serverAPI,
	shames: state.wallOfShame.newReports,
	registeredUser: state.userLoggedIn,
	user: state.user,
	comment: state.wallOfShame.newComment,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Shame);
