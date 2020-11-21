import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import axios from 'axios';

class SearchCollections extends Component {
	state = {};

	componentDidMount() {
		//this.props.setPageTitle(`Viewing Collection: ${this.props.currentAnimal._id}`);
		if (!!this.props.match.params.id) {
			axios({
				method: 'post',
				url: `${this.props.API}/collections/search`,
				headers: {
					Authorization: `Bearer ${localStorage.token}`,
				},
				data: {
					id: this.props.match.params.id,
				},
			})
				.then((response) => {
					if (response.status === 201) {
						this.props.currentAnimalDisplay(response.data[0]);
						//this.props.setPageTitle(`Viewing Collection: ${this.props.currentAnimal._id}`);
						this.props.history.push('/view_animal');
					}
				})
				.catch((error) => {
					if (error) {
						console.log('An error has occured', error);
					}
				});
		}
	}

	componentWillUnmount() {
		//this.props.hideLargeImage();
		//this.props.clearCurrentAnimalDisplay();
		//this.props.clearRecordsEditor();
	}

	render() {
		// if (!this.props.currentAnimal._id.length) {
		// 	return <div style={{ margin: 'auto', textAlign: 'center' }}>No collection record selected</div>;
		// }
		return <div></div>;
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	userInfo: state.user,
	React: state.config.analytics,
	currentAnimal: state.viewAnimal,
	selectedAnimalId: state.selectedAnimal.id,
	collectionsIds: state.wholeCollection,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchCollections);
