import React from 'react';
import '../Listing.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactHtmlParser from 'react-html-parser';
import * as actionCreators from '../../../../../actions/index';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactGA from 'react-ga';
import dayjs from 'dayjs';

class Gallery extends React.Component {
	state = {};

	componentDidMount() {
		this.props.setPageTitle(this.props.listTitle);
	}

	setTitle = (title) => {
		this.props.setPageTitle(title);
	};

	componentWillUnmount() {
		//this.props.loader(false);
		//this.props.clearClassifiedData();
	}

	close_floating_image = () => {
		this.setState({ floating_img: false });
		return;
	};

	display_image = (img) => {
		let largImage = img.replace('thumb', 'large');
		this.setState({
			file: largImage,
			floating_img: true,
		});
	};

	largImage = (img) => {
		this.props.displayLargeImage({
			display: 'block',
			img: `${img.URL}/${img.large}`,
			name: img.large,
		});
	};

	render() {
		if (!!this.props.React) {
			ReactGA.pageview(`/listing/${this.props.match.params.id}`);
		}
		//ReactGA.pageview(`/listing/${this.props.match.params.id}`);
		// !!this.props.listTitle ? this.props.setPageTitle(this.props.listTitle) : ''
		if (!!this.props.listTitle) {
			this.props.setPageTitle(this.props.listTitle);
		}
		const Listing = () => {
			// let list = this.state.listing;
			let list = this.props.classified_listing;
			return (
				<div className="list-box">
					{/* <div className="list-title">{list.title}</div> */}
					<div className="list-images">
						{list.images.thumbnail.map((img) => (
							<div className="classified-listing-thumbnail-images">
								<img
									src={`${this.props.USERSURL}/${list.username}/classifieds/${list.directory}/${img}`}
									alt="null"
									onClick={() => this.largImage(img)}
								/>
								{/* <img
                                src={`${this.props.USERSURL}/${list.username}/classifieds/${list.directory}/${img}`}
                                alt={img}
                                onClick={() => this.display_image(img)}
                            /> */}
							</div>
						))}
					</div>
				</div>
			);
		};

		return (
			<div className="list-box">
				{/* <div className="list-title">{list.title}</div> */}
				<div className="list-images">
					{this.props.classified_listing.images.thumbnail.map((img) => (
						<div className="classified-listing-thumbnail-images">
							<img
								src={`${this.props.USERSURL}/${get(this.props, 'classified_listing.username')}/classifieds/${
									this.props.classified_listing.directory
								}/${this.state.file}`}
								alt="null"
								onClick={() => this.display_image(img)}
							/>
							{/* <img src={`${this.props.USERSURL}/${list.username}/classifieds/${list.directory}/${img}`} alt={img} onClick={() => this.display_image(img)} /> */}
						</div>
					))}
				</div>

				<Listing />
			</div>
			//     <div>
			//         {this.state.floating_img === true ? (
			//             <div className="classified-listing-picture-display-gray-back" onClick={this.close_floating_image}>
			//                 <div className="classified-listing-picture-display">
			//                     <img
			//                         src={`${this.props.USERSURL}/${get(this.props, 'classified_listing.username')}/classifieds/${this.props.classified_listing.directory}/${
			//                             this.state.file
			//                         }`}
			//                         alt=""
			//                     />
			//                 </div>
			//             </div>
			//         ) : (
			//             ''
			//         )}
			// <Listing />
			//         {/* {this.props.classified_listing._id ? <Listing /> : ''} */}
			//     </div>
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
	React: state.config.analytics,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
