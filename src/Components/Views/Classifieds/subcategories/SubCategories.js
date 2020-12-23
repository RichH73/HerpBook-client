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
		ReactGA.pageview(pageTitle);
		axios({
			method: 'get',
			url: `${API}/listings/${id}`,
		}).then((response) => {
			// this.setState({
			// 	listings: response.data.listings,
			// });
			this.props.getSubCategoryListings({ listings: response.data.listings, pager: response.data.pager });
			this.props.pageLoading(false);
		});
	}

	emptyListingsResponse = (
		<div style={{ width: '90%', margin: 'auto' }}>
			<h4>No Listings</h4>
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
	//TODO Pagination
	// nextPage = () => {
	// 	let totalDocs = this.props.pageData.totalDocuments;
	// 	let totalPages = this.props.pageData.totalPages;
	// 	let currentPage = Math.floor((totalPages * 10) / totalDocs);
	// 	let nextPage = currentPage + 1;
	// };

	render() {
		const Listings = () => {
			let page = this.props.listingsData.map((list) => (
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
												<div>
													{list.username || list.user}{' '}
													{!!list.online ? <span style={{ color: 'green', fontStyle: 'bold' }}> (Online)</span> : <React.Fragment></React.Fragment>}
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</Link>
				</React.Fragment>
			));
			return (
				<React.Fragment>
					{page}
					{/* <div style={{display: 'flex'}}>
            <div>
              <button className="button" onClick={this.previousPage}>{"<"}</button>
            </div>
			<div style={{backgroundColor: 'orange', borderRadius: '7px', width: '2em', textAlign: 'center', padding: '5px'}}>{Math.floor(this.props.pageData.totalPages * 10 / this.props.pageData.totalDocuments)}</div>
            <div>
              <button className="button" onClick={this.nextPage}>{">"}</button>
            </div>
          </div> */}
				</React.Fragment>
			);
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
	pageData: state.subCategoryListings.pager,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SubCategory);
