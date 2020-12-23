import React from 'react';
import '../Listing.css';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactHtmlParser from 'react-html-parser';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import * as actionCreators from '../../../../../actions/index';
import _ from 'lodash';

// Bootstrap imports
import Table from 'react-bootstrap/Table';

class ClassifiedList extends React.Component {
	state = {
		listing: {},
		album: [],
		files: [],
		loading: true,
		floating_img: false,
		directory: '',
	};

	componentWillUnmount() {}

	click = (event) => {
		this.props.history.push({
			pathname: '/new-message',
			state: { listData: event },
		});
	};

	//TODO setup to use Redux

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
			<Table bordered size="md">
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
			</Table>
		);
	};

	render() {
		const { images } = this.props.classifiedData.listData;
		let list = this.props.classified_listing;
		return (
			<div className="list-box">
				<div className="list-box-inner">
					<div className="list-images">
						<div className="classified-listing-thumbnail-images">
							<img
								src={`${list.URL}/${_.get(images, '0.thumbnail')}`}
								alt={_.get(images, '0.thumbnail')}
								onClick={() => this.largImage(_.get(list, 'images.0'))}
							/>
						</div>
					</div>
					<div className="list-box-inner-table-data">
						<Table bordered size="md">
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
										{list.weightUnit}
									</td>
									<td>{!!list.userCreatedID ? list.userCreatedID : list._id}</td>
								</tr>
							</tbody>
						</Table>
						<div
							className="classified-listing-seller-other"
							style={{
								display: 'flex',
								justifyContent: 'space-evenly',
								margin: '.5em auto',
							}}>
							{/* {localStorage.token ? (
								<div>
									Seller: <Link to={`/profile`}>{list.username || list.user}</Link>
								</div>
							) : (
								<Link to="/login">Contact seller</Link>
							)} */}
							{localStorage.token ? (
								<div>
									<Link to={{ pathname: '/contact_seller', userToUid: list.creatorId, listSubject: `Classified ID: ${list._id}`, sellerData: list }}>
										Contact Seller
									</Link>
								</div>
							) : (
								<div>
									<Link to="/login">Login to contact Seller</Link>
								</div>
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
						<ReactQuill name="businessFooter" value={list.description} readOnly={true} theme="bubble" />
						<ReactQuill name="businessFooter" value={get(list, 'businessFooter', '')} readOnly={true} theme="bubble" />
						{/* {ReactHtmlParser(list.description)}
						{ReactHtmlParser(get(list, 'businessFooter', ''))} */}
						{!!list.businessName ? this.businessDisplay(list) : ''}
					</div>
				</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClassifiedList);
