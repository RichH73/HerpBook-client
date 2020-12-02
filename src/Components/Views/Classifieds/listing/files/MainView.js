import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import ClassifiedList from './ListPages/ClassifiedList';
import CollectionsList from './ListPages/CollectionsList';

class Main extends React.Component {
	state = {};

	componentDidMount() {}

	componentWillUnmount() {
		//this.props.clearClassifiedData();
	}

	render() {
		return !!this.props.isCollection ? <CollectionsList /> : <ClassifiedList />;
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	isCollection: state.classified.listData.isCollection,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
