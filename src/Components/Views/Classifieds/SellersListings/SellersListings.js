import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SellersListings.css';
import { connect } from 'react-redux';

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
		// const SellerListings = () => {
		//     return this.state.listings.map(list => (
		//         <Link to={`/listing/${list._id}`}>
		//         <div className='other-listing-box' key={list._id}>
		//             <div className='other-listing-img'><img src={`https://users.herpbook.com/${list.username}/classifieds/${list.directory}/${list.image}`} alt='' /></div>
		//               <div className='other-listing-title'>{list.title}</div>
		//               {/* <div className='other-listing-description'>{list.description.slice(0, 50)} ...</div> */}
		//               <div className='other-listing-price'>Price: ${list.price}</div>
		//               <div className='other-listing-gender'>Gender: {list.gender}</div>
		//               <div className='other-listing-date'>{list.created.split('T', 2)[0]}</div>
		//             </div>
		//        </Link>
		//             ))
		// }

		const SellerListings = () => {
			return this.state.listings.map((list) => (
				<React.Fragment>
					{''}
					<div className="my-listings-box" key={list._id}>
						<Link to={`/listing/${list._id}`}>
							<table>
								<tr>
									<td>
										<img src={`${this.props.USERSURL}/${list.username}/classifieds/${list.directory}/${list.image}`} alt={list.image} />
									</td>
									<td>
										<div className="my-listings-title">{list.title}</div>
									</td>
									<td>
										<div className="my-listings-gender">Gender: {list.gender}</div>
									</td>
									<td>
										<div className="my-listings-price">Price: ${list.price}</div>
									</td>
								</tr>
							</table>
						</Link>
					</div>
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
