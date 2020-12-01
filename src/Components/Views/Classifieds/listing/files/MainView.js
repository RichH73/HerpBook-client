import React from 'react';
import '../Listing.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactHtmlParser from 'react-html-parser';
import * as actionCreators from '../../../../../actions/index';
import ReactGA from 'react-ga';
import _ from 'lodash';

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

	//TODO setup to use Redux
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

	largImage = (img) => {
		this.props.displayLargeImage({
			display: 'block',
			img: `${img.URL}/${img.large}`,
			name: img.large,
		});
	};

	businessDisplay = (data) => {
		return (
			<table>
				<thead>
					<tr>
						<th>Business</th>
						<th>City</th>
						<th>State</th>
						<th>Phone</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{data.businessName}</td>
						<td>{data.businessCity}</td>
						<td>{data.businessState}</td>
						<td>{data.businessPhone}</td>
					</tr>
				</tbody>
			</table>
		);
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
			const { images } = this.props.classifiedData.listData;
			const c_images = this.props.classified_listing.collectionData;
			let list = this.props.classified_listing;
			const c_data = _.get(this.props, 'classifiedData.listData.collectionData', {});
			console.log('this data', c_data.URL);
			return (
				<div className="list-box">
					<div className="list-box-inner">
						<div className="list-images">
							<div className="classified-listing-thumbnail-images">
								<img
									src={`${c_data.URL}/${_.get(c_data.images, '0.thumbnail')}`}
									alt={_.get(images, '0.thumbnail')}
									onClick={() => this.largImage(_.get(c_data, 'images.0'))}
								/>
								<img
									src={`${list.URL}/${_.get(images, '0.thumbnail')}`}
									alt={_.get(images, '0.thumbnail')}
									onClick={() => this.largImage(_.get(list, 'images.0'))}
								/>
							</div>
						</div>
						<div className="list-box-inner-table-data">
							<table>
								<thead>
									<tr>
										<th>Price</th>
										<th>Gender</th>
										<th>Weight</th>
										<th>ID</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>{list.price}</td>
										<td>{list.gender}</td>
										<td>
											{list.weight}
											<span>{list.weightUnit}</span>
										</td>
										<td>{!!list.userListId ? list.userListId : list._id}</td>
									</tr>
								</tbody>
							</table>
							<div
								className="classified-listing-seller-other"
								style={{
									display: 'flex',
									justifyContent: 'space-evenly',
									margin: '.5em auto',
								}}
							>
								{localStorage.token ? (
									<div>
										Seller: <Link to={`/profile`}>{list.username || list.user}</Link>
									</div>
								) : (
									<Link to="/login">Contact seller</Link>
								)}
								<div style={{ color: 'blue' }}>
									<Link to={`/sellers-listings/${list.creatorId}`}>See all listing by seller</Link>
								</div>
							</div>
						</div>
					</div>
					<hr />

					<div className="list-info">
						<div className="list-description">
							<b>Sellers Description:</b>
							{ReactHtmlParser(list.description)}
							{ReactHtmlParser(get(list, 'businessFooter', ''))}
							{!!list.businessName ? this.businessDisplay(list) : ''}
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
	classifiedData: state.classified,
	React: state.config.analytics,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
