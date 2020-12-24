import React, { Component } from 'react';
import './Body.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import LeftNav from '../../Navigation/LeftNavigation/LeftNavigation';
import Pages from '../../Views/PageViews/BodyPages';
import LargeImage from '../../_services/DisplayLargeImage/LargeImage';
import MainView from '../../../Components/Views/Collections/DisplayAnimal/RecordOverlay/Master';
import SideDrawer from '../../../Components/Navigation/mobileMenu/sideDrawer';
import Backdrop from '../../../Components/Navigation/mobileMenu/Backdrop/Backdrop';

class Body extends Component {
	drawerToggleClickHandler = () => {
		if (!this.props.sideDrawerOpen) {
			this.props.openSideDrawer();
		}
		if (!!this.props.sideDrawerOpen) {
			this.props.closeSideDrawer();
		}
	};

	render() {
		let backdrop;
		let sideDrawer;
		if (!!this.props.sideDrawerOpen) {
			backdrop = <Backdrop click={this.backdropClickHandler} />;
			sideDrawer = <SideDrawer history={this.props.history} />;
		}
		return (
			<React.Fragment>
				{sideDrawer}
				{backdrop}
				<div className="mobile-nav-button-menu" onClick={this.drawerToggleClickHandler}>
					<img src="/images/hamburger_button.png" alt="nav" />
				</div>
				<div className="main-body-view">
					<LargeImage />
					<div className="body-left-panel">
						<LeftNav history={this.props.history} />
					</div>
					<div className="body-main-panel">
						<div className="body-main-outter-panel">
							<div className="body-main-header">
								<MainView />
								<h4>{this.props.navPageId}</h4>
							</div>
							<Pages socket={this.props.socket} />
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	navPageId: state.pageId,
	sideDrawerOpen: state.navDrawer.sideDrawerOpen,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Body);

/*


export default connect(mapStateToProps, mapDispatchToProps)(Shame);


*/
