import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';

class PublicProfile extends Component {
	state = {};
	componentDidMount() {}

	componentWillUnmount() {}

	render() {
		return <div>a user profile</div>;
	}
}

const mapStateToProps = (state) => ({
	userInfo: state.user,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicProfile);
