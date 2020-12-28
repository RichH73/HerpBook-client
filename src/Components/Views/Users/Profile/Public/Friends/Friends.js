import React, { Component } from 'react';
import './Friends.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import CardColumns from 'react-bootstrap/CardColumns';
import { Link } from 'react-router-dom';

class Friends extends Component {
	render() {
		const { User } = this.props;
		return (
			<div className="my-profile-friends-main">
				<CardColumns>
					{User.friends.map((friend) => (
						<Link to={`/user/${friend.username}`}>
							<Card style={{ width: '150px' }}>
								<Card.Img variant="top" src={`${friend.baseURL}/profile/${friend.profile_pic}`} style={{ maxWidth: '150px' }} />
								<Card.Body>
									<Card.Title>{`${friend.firstName} ${friend.lastName}`}</Card.Title>
								</Card.Body>
							</Card>
						</Link>
					))}
				</CardColumns>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	uid: state.user_profile.uid,
	about: state.user_profile.about,
	profile_pic: state.user_profile.profile_pic,
	image: state.user_profile.image,
	username: state.user_profile.username,
	email: state.user_profile.email,
	first_name: state.user_profile.first_name,
	last_name: state.user_profile.last_name,
	street: state.user_profile.street,
	city: state.user_profile.city,
	state: state.user_profile.state,
	zip_code: state.user_profile.zip_code,
	website: state.user_profile.website,
	business_name: state.user_profile.business_name,
	User: state.PublicProfile.User,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Friends);
