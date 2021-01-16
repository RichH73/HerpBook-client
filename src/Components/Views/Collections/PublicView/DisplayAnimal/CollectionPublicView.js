import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import 'react-tabs/style/react-tabs.css';
import './Collections.css';
import Animal from './AnimalView/Animal';
import Photos from './Photos';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Records from './AnimalView/Records';

class CollectionPublicView extends Component {
	state = {
		viewing: 'ANIMAL',
	};

	componentDidMount() {
		if (this.props.match.params.id) {
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
					if (response.status === 200) {
						this.props.currentAnimalDisplay(response.data[0]);
					}
				})
				.catch((error) => {
					if (error) {
						console.log('An error has occured', error);
					}
				});
		}

		this.props.setPageTitle(``);
	}

	componentWillUnmount() {
		this.props.hideLargeImage();
		this.props.clearCurrentAnimalDisplay();
		this.props.clearRecordsEditor();
	}

	componentSelector = (viewtype) => {
		this.setState({
			viewing: viewtype,
		});
	};

	componentView = () => {
		switch (this.state.viewing) {
			case 'ANIMAL':
				return <Animal match={this.props.match} />;
			case 'RECORDS':
				return <Records />;
			case 'GALLERY':
				return <Photos />;
			default:
				return <Animal />;
		}
	};

	render() {
		if (!this.props.currentAnimal._id.length) {
			return <div style={{ margin: 'auto', textAlign: 'center' }}>No collection record selected</div>;
		}
		const navStyles = { color: 'black', fontWeight: 'bold', cursor: 'pointer' };
		return (
			<React.Fragment>
				<Navbar
					style={{ backgroundColor: 'orange', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}
					variant="light"
					collapseOnSelect
					expand="sm">
					<Nav className="mr-auto">
						<Nav.Link onClick={() => this.componentSelector('ANIMAL')} style={navStyles}>
							Animal
						</Nav.Link>

						<Nav.Link onClick={() => this.componentSelector('RECORDS')} style={navStyles}>
							Records
						</Nav.Link>

						<Nav.Link onClick={() => this.componentSelector('GALLERY')} style={navStyles}>
							Gallery
						</Nav.Link>
					</Nav>
				</Navbar>
				{this.componentView()}
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
	currentAnimal: state.viewAnimal,
	selectedAnimalId: state.selectedAnimal.id,
	collectionsIds: state.myCollections,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionPublicView);
