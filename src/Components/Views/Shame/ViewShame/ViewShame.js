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
import dayjs from 'dayjs';
//import ImageCompress from 'quill-image-compress';

// Bootstrap imports
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

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
		imageCompress: {
			quality: 0.7, // default
			maxWidth: 400, // default
			maxHeight: 400, // default
			imageType: 'image/jpeg', // default
			debug: false, // default
		},
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
		this.props.setPageTitle('Wall of Shame Report');
		if (this.props.location.reportId) {
			this.props.pageLoading(true);
			setTimeout(() => {
				if (this.props.spinnerState === 'block') {
					this.props.pageLoading(false);
				}
			}, 20000);
			axios({
				url: `${this.props.API}/shame/get_report/${this.props.location.reportId}`,
				method: 'get',
			})
				.then((response) => {
					if (response.status === 200) {
						this.props.getReportData(response.data);
						this.props.setPageTitle(
							`Report for: ${response.data.reportType === 'BUSINESS' ? response.data.business_name : response.data.individual_name}`
						);
						this.props.pageLoading(false);
					}
				})
				.catch((error) => {
					console.log('An error occured', error);
				});
		}
	}

	componentWillUnmount() {
		this.props.clearRichText();
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
			comment: this.props.text,
			date: Date(),
		};
		this.props.pageLoading(true);
		setTimeout(() => {
			if (this.props.spinnerState === 'block') {
				this.props.pageLoading(false);
			}
		}, 20000);

		axios({
			method: 'post',
			url: `${this.props.API}/shame/new_report_comment`,
			headers: {
				Authorization: `bearer ${localStorage.token}`,
			},
			data: commentData,
		}).then((response) => {
			if (response.status === 201) {
				//this.props.shameReportComment(commentData);
				this.props.getReportData(response.data);
				this.props.clearRichText();
				this.props.pageLoading(false);
			}
		});
	};

	//TODO fix the min-height on read-only quill editor
	commentMapper = (comments) => {
		return this.props.report.shameComments.map((comment) => (
			<React.Fragment>
				<div className="wall-of-shame-user-report-comment">
					Comment by: {comment.username}
					<br />
					<small>{dayjs(comment.date).format('MM/DD/YYYY h:mmA')}</small>
					<br />
					<ReactQuill name="view-shame-incident-description" style={{ minHeight: '50px' }} value={comment.comment} readOnly={true} theme="bubble" />
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
		this.props.editText({
			text: value,
		});
	};

	returnReport = () => {
		const {
			//_id,
			reportType,
			business_email,
			//business_name,
			//business_owner,
			individual_email,
			business_phone,
			individual_phone,
			faceBook,
			incident_description,
			shameComments,
		} = this.props.report;

		switch (reportType) {
			case 'INDIVIDUAL':
				return (
					<div className="wall-of-shame-report">
						<Table bordered size="md">
							<thead>
								<tr>
									<td>Email</td>
									<td>Phone</td>
									<td>FaceBook Profile</td>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{individual_email}</td>
									<td>{individual_phone}</td>
									<td>
										<a href={`https://www.facebook.com/${faceBook}`} target="new">
											{faceBook}
										</a>
									</td>
								</tr>
							</tbody>
						</Table>
						<ReactQuill name="view-shame-incident-description" value={incident_description} readOnly={true} theme="bubble" />
						{/* <div className="view-shame-incident-description">{HtmlParser(incident_description)}</div> */}
						{shameComments ? <div className="wall-of-shame-user-report-comments">{this.commentMapper()}</div> : ''}
						<div className="wall-of-shame-user-report-leave-comment">
							<label className="field-input-label">Leave a comment:</label>
							<div className="wall-of-shame-user-leave-comment">
								<ReactQuill
									style={{ backgroundColor: 'white', color: 'black' }}
									name="description"
									value={this.props.text}
									onChange={this.newCommentHandler}
									modules={this.modules}
									// modules={this.props.mods.modules}
									formats={this.formats}
									readOnly={false}
									theme="snow"
									className="ql-input-editor"
								/>
							</div>
							<div className="wall-of-shame-user-report-comment-button">
								<Button variant="success" onClick={() => this.submitHandler(this.props.report)}>
									Submit
								</Button>
							</div>
						</div>
					</div>
				);
			case 'BUSINESS':
				return (
					<div className="wall-of-shame-report">
						<table>
							<thead>
								<tr>
									<td>Email</td>
									<td>Phone</td>
									<td>FaceBook Profile</td>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{business_email}</td>
									<td>{business_phone}</td>
									<td>
										<a href={`https://www.facebook.com/${faceBook}`} target="new">
											{faceBook}
										</a>
									</td>
								</tr>
							</tbody>
						</table>
						<ReactQuill name="view-shame-incident-description" value={incident_description} readOnly={true} theme="bubble" />
						{/* <div className="view-shame-incident-description">{HtmlParser(incident_description)}</div> */}
						{shameComments ? <div className="wall-of-shame-user-report-comments">{this.commentMapper()}</div> : ''}
						<div className="wall-of-shame-user-report-leave-comment">
							<label className="field-input-label">Leave a comment:</label>
							<div className="wall-of-shame-user-leave-comment">
								<ReactQuill
									style={{ backgroundColor: 'white', color: 'black' }}
									name="description"
									value={this.props.text}
									onChange={this.newCommentHandler}
									modules={this.modules}
									// modules={this.props.mods.modules}
									formats={this.formats}
									readOnly={false}
									theme="snow"
								/>
							</div>
							<div className="wall-of-shame-user-report-comment-button">
								<Button variant="success" onClick={() => this.submitHandler(this.props.report)}>
									Submit
								</Button>
							</div>
						</div>
					</div>
				);
			default:
				return;
		}
	};

	render() {
		return (
			<React.Fragment>
				<Container fluid="md">
					<Row>
						<Col>{this.returnReport()}</Col>
					</Row>
				</Container>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	shames: state.wallOfShame.newReports,
	registeredUser: state.userLoggedIn,
	user: state.user,
	comment: state.wallOfShame.newComment,
	shameData: state.wallOfShame,
	report: state.wallOfShame.report,
	spinnerState: state.spinner.display,
	text: state.richText.text,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewShame);
