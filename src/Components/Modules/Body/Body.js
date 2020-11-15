import React, { Component } from 'react';
import './Body.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import LeftNav from '../../Navigation/LeftNavigation/LeftNavigation';
import Pages from '../../Views/PageViews/BodyPages';
import LargeImage from '../../_services/DisplayLargeImage/LargeImage';
import MainView from '../../../Components/Views/Collections/DisplayAnimal/RecordOverlay/Master';

class Body extends Component {
	render() {
		return (
			<React.Fragment>
				<div className="main-body-view">
					<LargeImage />
					<div className="body-left-panel">
						<LeftNav history={this.props.history} />
					</div>
					<div className="body-main-panel">
						<div className="body-main-outter-panel">
							<div className="body-main-header">
								<MainView />
								<h3>{this.props.navPageId}</h3>
							</div>
							<Pages />
						</div>
					</div>
				</div>
			</React.Fragment>
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
