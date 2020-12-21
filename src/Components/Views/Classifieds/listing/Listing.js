import React from 'react';
// import './Listing.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Main from './files/MainView';
import Gallery from './files/Gallery/Gallery';
import Records from './files/Records/Records';
import ReactGA from 'react-ga';

class Listing extends React.Component {
	state = {
		listing: {},
		album: [],
		files: [],
		loading: true,
		floating_img: false,
		directory: '',
	};

	click = (event) => {
		this.props.history.push({
			pathname: '/new-message',
			state: { listData: event },
		});
	};

	componentDidMount() {
		ReactGA.pageview(`/list/${this.props.match.params.id}`);
		axios.get(`${this.props.API}/listings/list/${this.props.match.params.id}/`).then((response) => {
			//this.props.loader(false);
			if (localStorage.token) {
				this.props.get_user({ uid: response.data.username });
			}
			const listData = response.data;
			this.props.classified(listData);
		});
	}

	componentWillUnmount() {
		this.props.clearClassifiedData();
	}

	setTitle = (title) => {
		this.props.setPageTitle(title);
	};

	render() {
		return (
			<div className="collections-tab-header">
				<Tabs>
					<TabList>
						<Tab>Animal</Tab>
						<Tab>Gallery</Tab>
						{!!this.props.classified_listing.records ? <Tab>Records</Tab> : ''}
					</TabList>
					<div className="collections-tab-body">
						<TabPanel>
							<Main match={this.props.match} />
						</TabPanel>
						<TabPanel>
							<Gallery />
						</TabPanel>
						<TabPanel>{!!this.props.classified_listing.records ? <Records /> : ''}</TabPanel>
					</div>
				</Tabs>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	uid: state.user_profile.uid,
	username: state.user_profile.username,
	albums: state.pictures.albums,
	//loading: state.loader.loading,
	visitor_get_username: state.classified.listData.username,
	listTitle: state.classified.listData.title,
	classified_listing: state.classified.listData,
	classifiedImages: state.classified.listData.images,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Listing);
