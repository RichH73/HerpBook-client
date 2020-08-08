import React from 'react';
import './SubCategories.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../../../actions/index';
import ReactGA from 'react-ga';

class SubCategory extends React.Component {
	state = {
		listings: [],
	};
	componentDidMount() {
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
			this.setState({
				listings: response.data.listings,
			});
		});
	}

	render() {
		// <Link to={`/listing/${list._id}`}>
		// 	<div className="listing-box" key={list._id}>
		// 		{list.image ? (
		// 			<div className="listing-img">
		// 				<img src={`${this.props.USERSURL}/${list.username}/classifieds/${list.directory}/${list.image}`} alt={list.image} />
		// 			</div>
		// 		) : (
		// 			''
		// 		)}
		// 		{/* <div className="listing-description">{list.description.slice(0, 50)} ...</div> */}
		// 		<div className="listing-price">Price ${list.price}</div>
		// 		<div className="listing-title">{list.title}</div>
		// 		<div className="listing-gender">Gender: {list.gender}</div>
		// 		{/* <div className="listing-date">Listed on: {list.created.split('T', 2)[0]}</div> */}
		// 	</div>
		// </Link>
		const Listings = () => {
			return this.state.listings.map((list) => (
				<React.Fragment>
					<Link to={`/listing/${list._id}`}>
						<div className="listing-box" key={list._id}>
							<table>
								<tr>
									<td>
										<img src={`${this.props.USERSURL}/${list.username}/classifieds/${list.directory}/${list.image}`} alt={list.image} />
									</td>
									<td>
										<div className="listing-title">{list.title}</div>
									</td>
									<td>
										<div className="listing-gender">Gender: {list.gender}</div>
									</td>
									<td>
										<div className="listing-price">Price ${list.price}</div>
									</td>
								</tr>
							</table>
						</div>
					</Link>
				</React.Fragment>
			));
		};

		return <div className="listings-body">{this.state.listings.length > 0 ? <Listings /> : 'No listings'}</div>;
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
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SubCategory);
