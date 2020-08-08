import React, { Component } from 'react';
import './MyImages.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../../../../actions/index';
import ImageDrop from '../../../../functions/ImageDrop/Image-Drop';
import MyAlbums from './MyAlbums';

class MyImages extends Component {
	state = {};

	render() {
		return (
			<div>
				<ImageDrop {...this.props} />
				<h3>My Albums</h3>
				<MyAlbums />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		username: state.user.username,
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MyImages);
