import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import './MyCollections.css';

class MyImages extends Component {
	state = {};

	render() {
		return (
			<div className="my-collections">
				<p>My collections under construction.</p>
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
