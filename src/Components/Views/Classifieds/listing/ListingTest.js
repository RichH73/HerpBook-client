import React from 'react';
import './Listing.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactHtmlParser from 'react-html-parser';
import * as actionCreators from '../../../../actions/index';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactGA from 'react-ga';
import Main from './files/MainView';
import Gallery from './files/Gallery';

class ListingTest extends React.Component {
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
		axios.get(`${this.props.API}/listings/list/${this.props.match.params.id}/`).then((response) => {
			//this.props.loader(false);
			if (localStorage.token) {
				this.props.get_user({ uid: response.data.username });
			}
			this.setState({
				listing: response.data,
			});
			const listData = response.data;
			this.props.classified(listData);
		});
	}

	setTitle = (title) => {
		this.props.setPageTitle(title);
	};

	componentWillUnmount() {
		this.props.clearClassifiedData();
	}

	render() {
		const images = this.props.classifiedImages;
		return (
			<div className="collections-tab-header">
				<Tabs>
					<TabList>
						<Tab>Animal</Tab>
						{/* <Tab>Records</Tab>
						<Tab>Activity</Tab> */}
						{!!images.thumbnail ? <Tab>Gallery</Tab> : ''}
					</TabList>
					<div className="collections-tab-body">
						<TabPanel>
							<Main match={this.props.match} />
						</TabPanel>
						{/* <TabPanel>
							<Tabs>
								<TabList>
									<Tab>Feedings</Tab>
									<Tab>Pairings</Tab>
									<Tab>Sheddings</Tab>
								</TabList>
								<TabPanel>
									<Feedings />
								</TabPanel>
								<TabPanel>
									<Pairings />
								</TabPanel>
								<TabPanel>Shed</TabPanel>
							</Tabs>
						</TabPanel>
						<TabPanel>
							<Activity history={this.props.history} />
						</TabPanel> */}
						<TabPanel>
							<Gallery />
						</TabPanel>
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
	thumbnails: state.classified.listData.images.thumbnail,
	//loading: state.loader.loading,
	visitor_get_username: state.classified.listData.username,
	listTitle: state.classified.listData.title,
	classified_listing: state.classified.listData,
	classifiedImages: state.classified.listData.images,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ListingTest);
