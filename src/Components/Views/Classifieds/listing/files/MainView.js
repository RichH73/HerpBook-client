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

class Main extends React.Component {
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
		this.props.setPageTitle(this.props.listTitle);
		//this.props.loader(true);
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

	render() {
		//console.log('this is passed', this.props)
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
					<div style={{ display: 'flex' }}>
						<div className="list-images">
							{list.images.thumbnail.map((img) => (
								<div className="classified-listing-thumbnail-images">
									{console.log('this is list', list)}
									<img
										src={`${this.props.USERSURL}/${list.username}/classifieds/${list.directory}/${img}`}
										alt={img}
										onClick={() => this.display_image(img)}
									/>
								</div>
							))}
						</div>
						<div style={{ width: '50%', margin: 'auto' }}>
							<table>
								<tbody>
									<th>Price</th>
									<th>Gender</th>
									<th>Weight</th>
									<th>ID</th>
									<tr>
										<td>${list.price}</td>
										<td>{list.gender}</td>
										<td>
											{list.weight}
											<span>{list.weightUnit}</span>
										</td>
										<td>{list.userListId}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<hr />

					<div className="list-info">
						<div className="list-price">
							<label className="field-input-label">Price: </label>${list.price}
						</div>
						{!!list.userListId ? (
							<div className="list-user-list-id">
								<label className="field-input-label">ID: </label>
								{list.userListId}
							</div>
						) : (
							''
						)}

						{!!list.gender ? (
							<div className="list-gender">
								<label className="field-input-label">Gender: </label>
								{list.gender}
							</div>
						) : (
							''
						)}
						{!!list.weight ? (
							<div className="list-weight">
								<label className="field-input-label">Weight: </label>
								{list.weight}
								<span>{list.weightUnit}</span>
							</div>
						) : (
							''
						)}
						<div className="list-description">
							<b>Sellers Description:</b>
							{ReactHtmlParser(list.description)}
						</div>
						<div className="list-description-businessFooter">{ReactHtmlParser(get(list, 'businessFooter', ''))}</div>
						<div className="list-footer">
							{/* {localStorage.token ? (
								<div>
									Seller: <Link to={`/profile`}>{list.username}</Link>
								</div>
							) : (
								<Link to="/login">Login to see profile</Link>
							)} */}
							{/* <div onLoad={this.props.get_user({ uid: list.username })}> */}
							<div>
								<Link to={`/sellers-listings/${list.creatorId}`}>See all listing by seller</Link>
							</div>
							{localStorage.token ? (
								<div>
									<Link to={{ pathname: '/message-seller', userToUid: list.creatorId, listSubject: list.title, sellerData: list }}>
										Contact Seller
									</Link>
								</div>
							) : (
								<div>
									<Link to="/login">Login to contact Seller</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			);
		};

		return (
			<div>
				{this.state.floating_img === true ? (
					<div className="classified-listing-picture-display-gray-back" onClick={this.close_floating_image}>
						<div className="classified-listing-picture-display">
							<img
								src={`${this.props.USERSURL}/${get(this.props, 'classified_listing.username')}/classifieds/${this.state.listing.directory}/${
									this.state.file
								}`}
								alt=""
							/>
						</div>
					</div>
				) : (
					''
				)}

				{this.state.listing._id ? <Listing /> : ''}
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
	React: state.config.analytics,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
