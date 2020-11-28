import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MyListings.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import dayjs from 'dayjs';
import ReactGA from 'react-ga';
class MyListings extends Component {
	state = {
		listings: [],
	};
	componentDidMount() {
		if (!!this.props.React) {
			ReactGA.pageview('/my_listings');
		}
		this.props.setPageTitle('My Classified Listings');
		axios({
			method: 'get',
			url: `${this.props.API}/listings/seller/${this.props.uid}`,
		}).then((response) => {
			this.setState({
				listings: response.data.listings,
			});
		});
	}

	delete_listing = (listing) => {
		let delete_list = window.confirm('Delete this listing?');
		if (delete_list === true) {
			axios({
				method: 'post',
				url: `${this.props.API}/listings/delete_listing`,
				headers: {
					Authorization: `Bearer ${localStorage.token}`,
				},
				data: {
					list_id: listing,
				},
			}).then((response) => {
				if (response.status === 200) {
					this.setState({
						listings: this.state.listings.filter((list) => list._id !== listing),
					});
				}
			});
		}
	};

	render() {
		const SellerListings = () => {
			return this.state.listings.map((list) => (
				<React.Fragment>
					<div className="my-listings-box" key={list._id}>
						<div className="my-listings-box-image">
							<Link to={`/listing/${list._id}`}>
								<img src={`${list.URL}/${list.image}`} alt={list.image} />
							</Link>
						</div>
						<div className="my-listings-delete">
							<button onClick={() => this.delete_listing(list)} className="button">
								Delete
							</button>
						</div>
						<div className="my-listings-box-info">
							<Link to={`/listing/${list._id}`}>
								<table>
									<thead>
										<tr>
											<th>Title</th>
											<th>Gender</th>
											<th>Price</th>
											<th>Listed On</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												<div className="my-listings-title">{list.title}</div>
											</td>
											<td>{!!list.gender ? <div className="my-listings-gender">{list.gender}</div> : ''}</td>
											<td>
												<div className="my-listings-price">{list.price}</div>
											</td>
											<td>
												<div>{dayjs(list.created).format('MM/DD/YYYY')}</div>
											</td>
										</tr>
									</tbody>
								</table>
							</Link>
						</div>
					</div>
				</React.Fragment>
			));
		};

		return <div className="my-listings-body">{this.state.listings.length > 0 ? <SellerListings /> : ''}</div>;
	}
}

const mapStateToProps = (state) => ({
	about: state.user.about,
	business_name: state.user.business_name,
	city: state.user.city,
	email: state.user.email,
	first_name: state.user.first_name,
	image: state.user.image,
	last_name: state.user.last_name,
	my_friends_list: state.user.my_friends_list,
	posts: state.user_posts.posts || [],
	profile_pic: state.user.profile_pic,
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	state: state.user.state,
	street: state.user.street,
	uid: state.user.uid,
	username: state.user.username,
	website: state.user.website,
	zip_code: state.user.zip_code,
	React: state.config.analytics,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MyListings);
