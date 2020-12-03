import React from 'react';
import './SubCategories.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../../../actions/index';
import ReactGA from 'react-ga';
import dayjs from 'dayjs';

class SubCategory extends React.Component {
	state = {
		listings: [],
	};
	componentDidMount() {
		this.props.pageLoading(true);
		const { API, subCategories } = this.props;
		const { id } = this.props.match.params;
		const pageTitle = subCategories
			.map((subCategory) => subCategory)
			.filter((subCategory) => {
				return subCategory.id === Number(id);
			})[0].name;
		this.props.setPageTitle(`Classifieds Sub-Category: ${pageTitle}`);
		if (!!this.props.ReactGA) {
			ReactGA.pageview(pageTitle);
		}
		axios({
			method: 'get',
			url: `${API}/listings/${id}`,
		}).then((response) => {
			// this.setState({
			// 	listings: response.data.listings,
			// });
			this.props.getSubCategoryListings(response.data.listings);
			this.props.pageLoading(false);
		});
	}

	emptyListingsResponse = (
		<div style={{ width: '90%', margin: 'auto' }}>
			<h3>No Listings</h3>
			<p>
				Sorry, there were no listings in this category. If you have something that you would like to sell please feel free to create a free account.
				Then create a classified listing here so the next person doens't see this message{' '}
				<span className="ap ap-sunglasses" role="img" aria-label="sun glasses">
					😎
				</span>
			</p>
			<p>Also help us spread the word to other reptile enthusiasts by letting them know about this site.</p>
		</div>
	);
	// }

	render() {
		const Listings = () => {
			return this.props.listingsData.map((list) => (
				<React.Fragment>
					<Link to={`/listing/${list._id}`}>
						<div className="listing-box" key={list._id}>
							<div className="listing-box-image">
								<img src={`${list.URL}/${list.image}`} alt={list.image} />
							</div>
							<div className="listing-box-info">
								<table>
									<thead>
										<tr>
											<th>Price</th>
											<th>Gender</th>
											<th>Listed</th>
											<th>Seller</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												{' '}
												<div className="listing-price">{list.price}</div>
											</td>
											<td>{!!list.gender ? <div className="listing-gender">{list.gender}</div> : ''}</td>
											<td>
												<div className="listing-title">{dayjs(list.created).format('MM/DD/YYYY')}</div>
											</td>
											<td>
												<div>{list.username || list.user}</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</Link>
				</React.Fragment>
			));
		};

		return <div className="listings-body">{!!this.props.listingsData.length > 0 ? <Listings /> : this.emptyListingsResponse}</div>;
	}
}

const mapStateToProps = (state) => ({
	categories: state.categories.categories,
	subCategories: state.categories.subCategories,
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	USERS: state.config.server.serverUSERS,
	ReactGA: state.config.analytics,
	listingsData: state.subCategoryListings.listings,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SubCategory);
