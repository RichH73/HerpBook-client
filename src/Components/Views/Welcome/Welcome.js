import React, { Component } from 'react';
import './Welcome.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';
class Welcome extends Component {
	state = {
		news: '',
	};
	componentDidMount() {
		if (!!this.props.React) {
			ReactGA.pageview('/welcome');
		}
		const { uid, firstName, entityEmail } = this.props.userInfo;
		const usersName = !!firstName ? firstName : entityEmail;
		if (!!uid) {
			this.props.setPageTitle(`Welcome back ${usersName}`);
		}
		if (!uid) {
			this.props.setPageTitle('Welcome');
		}

		axios({
			method: 'get',
			url: `${this.props.API}/news`,
		}).then((response) => {
			this.setState({
				news: response.data[0].body,
			});
		});
	}

	render() {
		return (
			<React.Fragment>
				<div className="welcome-page-main">{ReactHtmlParser(this.state.news)}</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	userInfo: state.user,
	React: state.config.analytics,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
