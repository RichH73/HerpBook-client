import React from 'react';
// import './Listing.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactHtmlParser from 'react-html-parser';
import * as actionCreators from '../../../../../../actions/index';
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
	componentDidMount() {}

	componentWillUnmount() {
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
		const images = _.get(this.props, 'collectionData.images', []);
		let list = _.get(this.props, 'classifiedData', {});
		let collection = this.props.collectionData;
		return (
			<div className="list-box">
				<div className="list-box-inner">
					<div className="list-images">
						<div className="classified-listing-thumbnail-images">
							<img
								src={`${collection.URL}/${_.get(images, '0.thumbnail')}`}
								alt={_.get(images, '0.thumbnail')}
								onClick={() => this.largImage(_.get(collection, 'images.0'))}
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
						{ReactHtmlParser(list.comments)}
						{ReactHtmlParser(get(list, 'businessFooter', ''))}
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
	newCol: state.classified.listData,
	collectionData: state.classified.listData.collectionData,
	classifiedData: state.classified.listData,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
