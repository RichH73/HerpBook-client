import React, { Component } from 'react';
import './Welcome.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import ReactHtmlParser from 'react-html-parser';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import axios from 'axios';
import ReactGA from 'react-ga';
import { Like } from 'react-facebook';
class Welcome extends Component {
	state = {
		news: [],
	};
	componentDidMount() {
		ReactGA.pageview('/welcome');

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
			let newsArray = [];
			let visableFilter = response.data.map((article) => {
				if (!!article.visable) {
					newsArray.push(article);
				}
			});
			this.setState({
				news: newsArray,
			});
		});
	}

	showHideScanner = () => {
		if (!!this.state.showScanner) {
			this.setState({
				showScanner: false,
			});
		}
		if (!this.state.showScanner) {
			this.setState({
				showScanner: true,
			});
		}
	};

	render() {
		return (
			<React.Fragment>
				<div className="welcome-page-main">
					<div className="welcome-page-main-text">
						{this.state.news.map((ns) => (
							<div className="welcome-page-main-text-article">
								<h4>{ns.title}</h4>
								<ReactQuill name="businessFooter" value={ns.body} readOnly={true} theme="bubble" />
							</div>
						))}
					</div>
					<div className="welcome-page-fb-like">
						<Like href="https://www.facebook.com/HerpBookcom-2378686682182233" colorScheme="light" share />
					</div>
				</div>
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
