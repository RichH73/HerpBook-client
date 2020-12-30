import React, { Component } from 'react';
import './Friends.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import CardColumns from 'react-bootstrap/CardColumns';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Friends extends Component {
	render() {
		const { User } = this.props;
		if (!this.props.userInfo.uid) {
			this.props.history.push('/login');
		}
		return (
			<React.Fragment>
				<div className="my-profile-friends-main">
					{/* <Container fluid> */}
					{/* <Row> */}
					{User.my_friends.map((friend) => (
						// <Col xs={8} sm={4} md={4} lg={4}>

						<Link to={`/user/${friend.username}`}>
							<div className="my-profile-friends-card">
								<img variant="top" src={`${friend.baseURL}/profile/${friend.profile_pic}`} className="my-profile-friends-card-image" />
								<div className="my-profile-friends-card-body">
									<small>{`${friend.firstName} ${friend.lastName}`}</small>
								</div>
							</div>
						</Link>
						// </Col>
					))}
					{/* </Row> */}
					{/* </Container> */}
				</div>
			</React.Fragment>
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
	userInfo: state.user,
	User: state.PublicProfile.User,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Friends);

/*

<div className="my-profile-friends-main">
					<CardColumns sm={2} md={3} lg={4}>
						{User.my_friends.map((friend) => (
							<Link to={`/user/${friend.username}`}>
								<Card style={{ width: '100px' }} border='primary'>
									<Card.Img variant="top" src={`${friend.baseURL}/profile/${friend.profile_pic}`} style={{ maxWidth: '150px' }} />
									<Card.Body>
										<Card.Text>{`${friend.firstName} ${friend.lastName}`}</Card.Text>
									</Card.Body>
								</Card>
							</Link>
						))}
					</CardColumns>
				</div>


<Link to={`/user/${friend.username}`}>
	<Card style={{ width: '150px' }}>
		<Card.Img variant="top" src={`${friend.baseURL}/profile/${friend.profile_pic}`} style={{ maxWidth: '150px' }} />
		<Card.Body>
			<Card.Title>{`${friend.firstName} ${friend.lastName}`}</Card.Title>
		</Card.Body>
	</Card>
</Link>

*/
