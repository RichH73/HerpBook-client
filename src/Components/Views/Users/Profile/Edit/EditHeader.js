import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import './EditHeader.css';
import EditProfile from './EditProfile';
import About from './About/About';
import MyImages from './MyImages/MyImages';
import MyCollections from './MyCollections/MyCollections';

class EditHeader extends Component {
	state = {
		page: 'profile',
	};

	page_selector = (page) => {
		this.setState({
			page: page,
		});
	};

	page_loader = () => {
		switch (this.state.page) {
			case 'profile':
				return <EditProfile {...this.props} />;

			case 'about':
				return <About {...this.props} />;

			case 'images':
				return <MyImages />;

			case 'collections':
				return <MyCollections />;

			default:
				return <EditProfile {...this.props} />;
		}
	};

	render() {
		const { imageGalleries, collections } = this.props.modules;
		return (
			<div className="edit-header">
				<div className="edit-nav">
					<div className="edit-profile-link" onClick={() => this.page_selector('profile')}>
						Profile
					</div>
					<div className="edit-profile-link" onClick={() => this.page_selector('about')}>
						About
					</div>
					{collections ? (
						<div className="edit-profile-link" onClick={() => this.page_selector('collections')}>
							Collections
						</div>
					) : (
						''
					)}
					{imageGalleries ? (
						<div className="edit-profile-link" onClick={() => this.page_selector('images')}>
							Pictures
						</div>
					) : (
						''
					)}
				</div>
				<this.page_loader />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		username: state.user.username,
		modules: state.config.modules,
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditHeader);
