import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SellersListings.css';
import { connect } from 'react-redux';
import { get } from 'lodash';

class SellersOtherListings extends Component {
	state = {
		listings: [],
	};
	componentDidMount() {
		axios({
			method: 'get',
			url: `${this.props.API}/listings/seller/${this.props.match.params.id}`,
		}).then((response) => {
			this.setState({ listings: response.data.listings });
		});
	}

	render() {
		const SellerListings = () => {
			return this.state.listings.map((list) => (
				<React.Fragment key={list._id}>
					<Link to={`/listing/${list._id}`}>
						<div className="my-listings-box" key={list._id}>
							<div style={{ textAlign: 'center', margin: 'auto' }}>
								<img src={`${list.URL}/${list.image}`} alt={list.image} />
							</div>
							<div className="listing-box-info" style={{ width: '80%', margin: 'auto' }}>
								<table>
									<thead>
										<tr>
											<th>Price</th>
											<th>Gender</th>
											<th>Seller</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												<div className="listing-title">{list.price}</div>
											</td>
											<td>{!!list.gender ? <div className="listing-gender">{list.gender}</div> : ''}</td>
											<td>
												<div>{get(list, 'username', get(list, 'user'))}</div>
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

		return <div className="listings-body">{this.state.listings.length > 0 ? <SellerListings /> : ''}</div>;
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
});

export default connect(mapStateToProps)(SellersOtherListings);
