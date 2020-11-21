import date from 'date-and-time';
import './ViewShame.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import React, { Component } from 'react';
import { get } from 'lodash';
import axios from 'axios';
// import { Link } from 'react-router-dom';
// import ReactGA from 'react-ga';
// import ReactHtmlParser from 'react-html-parser';
import HtmlParser from 'react-html-parser';
import ReactQuill from 'react-quill';
// import QuillEmoji from 'quill-emoji';
class ViewShame extends Component {
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

	modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['link', 'image', 'video'],
			['emoji'],
			['clean'],
		],
		'emoji-toolbar': true,
		'emoji-textarea': false,
		'emoji-shortname': true,
	};
	formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'emoji', 'link', 'image', 'video', 'clean'];

	componentDidMount() {
		//ReactGA.pageview("/welcome");
	}

	submitHandler = (data) => {
		const { uid, username, first_name, last_name } = this.props.user;
		//const commentBox = this.refs.commentBox;
		let commentData = {
			reportId: get(data, '_id'),
			uid: uid,
			username: username,
			firstName: first_name,
			lastName: last_name,
			comment: this.props.comment,
			date: Date(),
		};

		axios({
			method: 'post',
			url: `${this.props.API}/shame/new_report_comment`,
			headers: {
				Authorization: `bearer ${localStorage.token}`,
			},
			data: commentData,
		}).then((response) => {
			console.log({
				commentData: commentData,
				responseData: response.data,
			});
			if (response.status === 201) {
				this.props.shameReportComment(commentData);
				this.props.clearRichText();
				// commentBox.value = ''
				//this.props.history.push('/user_reports')
			}
		});
	};

	commentMapper = (comments) => {
		return comments.map((comment) => (
			<React.Fragment>
				<div className="wall-of-shame-user-report-comment">
					Comment by: {comment.username}
					<br />
					<small>{date.format(new Date(comment.date), 'dddd MMMM DD h:mmA')}</small>
					<br />
					{HtmlParser(comment.comment)}
				</div>
			</React.Fragment>
		));
	};

	onChangeHandler = (event, report) => {
		event.preventDefault();
		this.props.fileNewReport([event.target.name], event.target.value);
		this.props.fileNewReport('testing', report);
	};

	newCommentHandler = (value) => {
		this.props.newShameComment(value);
	};

	render() {
		const pattern = date.compile('MMM D YYYY h:m:s A');
		const myDate = date.parse('Mar 22 2019 2:54:21 PM', pattern);
		if (this.props.location.reportId === undefined) this.props.history.push('/user_reports');
		const report = this.props.shames.filter((shame) => shame._id === this.props.location.reportId);
		//const { username } = this.props.user;
		return (
			<React.Fragment>
				{report.map((report) => (
					<div className="wall-of-shame-user-reports">
						<div className="wall-of-shame-user-report">
							<div className="wall-of-shame-user-reports-business-name">
								<h3>{report.business_name}</h3>
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

							<div className="wall-of-shame-user-reports-incident-desription">
								<label className="wall-of-shame-user-reports-label">Description of issue:</label>
								<div className="wall-of-shame-user-reports-incident-description">{HtmlParser(report.incident_description)}</div>
							</div>

							{report.shameComments ? <div className="wall-of-shame-user-report-comments">{this.commentMapper(report.shameComments)}</div> : ''}
							<div className="wall-of-shame-user-report-leave-comment">
								<label className="field-input-label">Leave a comment:</label>
								<div>
									<ReactQuill
										style={{ backgroundColor: 'white', color: 'black' }}
										name="description"
										value={this.props.shameData.newComment}
										onChange={this.newCommentHandler}
										modules={this.modules}
										// modules={this.props.mods.modules}
										formats={this.formats}
										readOnly={false}
										theme="snow"
									/>
								</div>
								<div>
									<button onClick={() => this.submitHandler(report)}>Submit</button>
								</div>
							</div>
							{this.props.floatImage ? (
								<div style={this.props.displayFloatingImage.styles} onClick={this.hideFloatingImage}>
									<div className="wall-of-shame-user-report-imgFl">
										<img src={this.props.imgAddress} alt="" />
									</div>
								</div>
							) : (
								''
							)}
						</div>
					</div>
				))}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	//displayFloatingImage: state.floatingImage,
	//floatImage: state.floatingImage.displayFloatingImage,
	//imgAddress: state.floatingImage.image,
	API: state.config.server.serverAPI,
	shames: state.wallOfShame.newReports,
	registeredUser: state.userLoggedIn,
	user: state.user,
	comment: state.wallOfShame.newComment,
	// comment: state.richText.text,
	shameData: state.wallOfShame,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewShame);
