import React, { Component } from 'react';
import './MainPage.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import axios from 'axios';
import ReactGA from 'react-ga';
import { Link } from 'react-router-dom';
import { Like } from 'react-facebook';

//Image Imports
import classified_business_listing_small from '../../../images/classified_business_listing_small.png';
import classified_records_small from '../../../images/classified_records_small.png';
import records_pdf_small from '../../../images/records_pdf_small.png';
import mail_message_small from '../../../images/mail_message_small.png';

class VisitorWelcome extends Component {
	state = {
		news: [],
	};
	componentDidMount() {
		ReactGA.pageview('/');
		this.props.setPageTitle('Welcome to HerpBook');
	}

	render() {
		return (
			<React.Fragment>
				<div className="visitor-welcome-page">
					<h4>A reptile and amphibian keepers helper.</h4>
					<h5>Here are some of the features we offer.</h5>
					<div className="visitor-welcome-wall-of-shame visitor-new-section">
						<h5>Wall of Shame</h5>
						<p>
							Unfortunately, as with anything else in life there are those that show less than favorable business practice. This is a place those
							individuals and businesses can be listed to help others avoid problems. All reports are groomed prior to going live. We offer an
							unbiased view and take no active part aside from trying to keep things civil.
						</p>
					</div>
					<div className="visitor-welcome-classifieds visitor-new-section">
						<h5>Classified Listings</h5>
						<p>
							We offer a place to sell your animals, supplies, feeders etc. We offer both personal and business accounts. Business accounts offer
							extra perks, like the ability to add brandable logos to all of your classified ads and footer information pertaining to additional
							business details etc., and no limitations on the number of classified listings.
						</p>
						<div className="visitor-welcome-image">
							<Link to="/images/classified_business_listing.png" target="new">
								<img src={classified_business_listing_small} alt="classified_business_listing_small" />
								<br />
								<span>
									<small>Business listing example</small>
								</span>
							</Link>
						</div>
					</div>
					<div className="visitor-welcome-collections visitor-new-section">
						<h5>My Collections</h5>
						<p>
							We are very proud of our My Collections module; this is the place to go to track all of your animal needs and care. We offer the ability
							to track Feeding, shedding, pairing and weight records for your collections.
						</p>
						<p>
							This module works with My Clutches to help track the lineage of your animals in the case of breeders and offer a way to show your
							patrons the progress and care that each animal receives. Classified listings created from a collection offer you a way to show realtime
							records and pictures to patrons that visit your classified listings.
						</p>
						<div className="visitor-welcome-image">
							<Link to="/images/classified_records.png" target="new">
								<img src={classified_records_small} alt="classified_business_listing_small" />
								<br />
								<span>
									<small>Classified listing records example</small>
								</span>
							</Link>
						</div>
						<div className="visitor-new-section">
							<p>
								Please keep in mind, this isn't only a tool for sellers and breeders etc. Anyone one can use this tool for tracking even the regular
								day to day care that you give your animals.
							</p>
							<p>
								You also have the option to print out paper records for each collection. This is particularly handy in sending a customized paper
								report along with a pet for the new owners to see past history.
							</p>
							<div className="visitor-welcome-image">
								<Link to="/images/records_pdf.png" target="new">
									<img src={records_pdf_small} alt="records_pdf_small" />
									<br />
									<span>
										<small>Paper records example</small>
									</span>
								</Link>
							</div>
						</div>
					</div>
					<div className="visitor-welcome-mail visitor-new-section">
						<h5>In app mail</h5>
						<p>
							Sometimes dealing with new contacts and customers can be frustrating, we get it. To help avoid some of those problems, we have built a
							real-time mail module that you can use if you do not wish to publish contact information. If another user or visitor wishes to contact,
							you they can do so through our mail. If you are not online at the time of the contact, our system recognizes this and will send you a
							notification to your email address all while not revealing your personal contact information.
						</p>
						<div className="visitor-welcome-image">
							<Link to="/images/mail_message.png" target="new">
								<img src={mail_message_small} alt="mail_message_small" />
								<br />
								<span>
									<small>Paper records example</small>
								</span>
							</Link>
						</div>
					</div>
					<div className="visitor-new-section">
						<p>
							Apart from regular development and implementation of new features we also perform daily maintenance and backups of all data. Let’s face
							it, not much compares to losing all of your work due to equipment failure.
						</p>
						<p>Business accounts also receive free tailored support via, in-app mail, email, chat or phone.</p>
					</div>
					<div className="visitor-new-section">
						<p>
							These are some of the tools we currently offer with plans to include more on the way. If you feel as though you might benefit from using
							out application, you are encouraged to <Link to="/register">sign up</Link> for an account and get started right away.
						</p>
					</div>
					<div className="welcome-page-fb-like">
						<Like href="https://www.facebook.com/HerpBookcom-2378686682182233" colorScheme="light" share />
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	userInfo: state.user,
	React: state.config.analytics,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(VisitorWelcome);
