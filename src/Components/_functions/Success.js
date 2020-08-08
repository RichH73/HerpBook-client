import React from 'react';
import './Success.css';
import { Link } from 'react-router-dom';

const sitecontact = <h3>Thank you for reaching out to us, we will contact you as soon as possible.</h3>;

const classifiedListing = (
	<div>
		<h3>Your listing has been posted to our classifieds.</h3>
		<h4>Thank you for choosing to list with us.</h4>
	</div>
);

const new_breeder = (
	<div>
		<h3>Thanks for your submission</h3>
		<h5>Once this vendor has been verified they will appear in the breeders list.</h5>
	</div>
);

const classifiedcontact = <h3>Your message has been sent to the classified poster.</h3>;

const profileUpdate = () => {
	const message = <h3>Your profile has been updated.</h3>;
	return message;
};

const account_creation = () => {
	const message = (
		<div>
			<h4>Account Created!</h4>
			{/* <p>Please check your email to complete signup.</p> */}
			<p>
				You may now log into your account <Link to="/login">Here.</Link>
			</p>
		</div>
	);
	return message;
};

const PageReturn = (referer) => {
	switch (referer.referer) {
		case 'sitecontact':
			return sitecontact;

		case 'classifiedcontact':
			return classifiedcontact;

		case 'profileUpdate':
			return profileUpdate();

		case 'classified_listing':
			return classifiedListing;

		case 'register':
			return account_creation();

		case 'new_breeder':
			return new_breeder;

		default:
	}
};

const Success = (props) => {
	return <PageReturn referer={props.match.params.refer} />;
};

export default Success;
