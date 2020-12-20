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
	state = {};
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

	user_reports = () => {
		return this.props.shames.map((report) => {
			switch (report.reportType) {
				case 'BUSINESS':
					return (
						<React.Fragment>
							<Link to={{ pathname: '/view_shame', reportId: report.id }}>
								<div className="wall-of-shame-user-reports" style={{ width: '98%', margin: 'auto', border: '1px solid orange', borderRadius: '7px' }}>
									<h3>{report.business_name}</h3>
									<table style={{ width: '98%', margin: '0 auto .5em' }}>
										<thead>
											<tr>
												<td style={{ fontWeight: 'bold', textAlign: 'center' }}>Website</td>
												<td style={{ fontWeight: 'bold', textAlign: 'center' }}>Phone Number</td>
												<td style={{ fontWeight: 'bold', textAlign: 'center' }}>Individual or owners name</td>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td style={{ textAlign: 'center' }}>{report.business_website}</td>
												<td style={{ textAlign: 'center' }}>{report.business_phone}</td>
												<td style={{ textAlign: 'center' }}>{report.business_owner}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</Link>
						</React.Fragment>
					);
				case 'INDIVIDUAL':
					return (
						<React.Fragment>
							<Link to={{ pathname: '/view_shame', reportId: report.id }}>
								<div className="wall-of-shame-user-reports" style={{ width: '98%', margin: 'auto', border: '1px solid orange', borderRadius: '7px' }}>
									<h3>{report.individual_name}</h3>
									<table style={{ width: '98%', margin: '0 auto .5em' }}>
										<thead>
											<tr>
												{/* <td style={{ fontWeight: 'bold', textAlign: 'center' }}>Website</td> */}
												<td style={{ fontWeight: 'bold', textAlign: 'center' }}>Phone Number</td>
												<td style={{ fontWeight: 'bold', textAlign: 'center' }}>Email</td>
												<td style={{ fontWeight: 'bold', textAlign: 'center' }}>Facebook profile</td>
											</tr>
										</thead>
										<tbody>
											<tr>
												{/* <td style={{ textAlign: 'center' }}>{report.individual_website}</td> */}
												<td style={{ textAlign: 'center' }}>{report.individual_phone}</td>
												<td style={{ textAlign: 'center' }}>{report.individual_email}</td>
												<td style={{ textAlign: 'center' }}>{report.faceBook}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</Link>
						</React.Fragment>
					);
			}
		});
	};

	render() {
		return (
			<React.Fragment>
				<div>
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
						<Link to="/file_report">Click here to file a new report.</Link>
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
