import React, { Component } from 'react';
import './Body.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import LeftNav from '../../Navigation/LeftNavigation/LeftNavigation';
import Pages from '../../Views/PageViews/BodyPages';
class Body extends Component {
	render() {
		return (
			<div className="main-body-view">
				<div className="body-left-panel">
					<LeftNav />
				</div>
				<div className="body-main-panel">
					<div className="body-main-outter-panel">
						<div className="body-main-header">
							<h3>{this.props.navPageId}</h3>
						</div>
						<Pages />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	// displayFloatingImage: state.floatingImage,
	// floatImage: state.floatingImage.displayFloatingImage,
	// imgAddress: state.floatingImage.image,
	// serverAPI: state.config.serverAPI,
	// shames: state.wallOfShame.newReports,
	// registeredUser: state.userLoggedIn,
	// user: state.user,
	// comment: state.wallOfShame.newComment
	navPageId: state.pageId,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Body);

/*


export default connect(mapStateToProps, mapDispatchToProps)(Shame);


*/
