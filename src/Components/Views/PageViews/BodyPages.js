import React from 'react';
import Vendors from '../VendorList/Vendors';
import Categories from '../Classifieds/Categories/Categories';
import { Route } from 'react-router-dom';
import SubCategories from '../Classifieds/subcategories/SubCategories';
import Login from '../Users/Login/Login';
import Register from '../Users/Register/Register';
import Welcome from '../Welcome/Welcome';
import EditProfile from '../Users/Profile/Edit/EditProfile';
import Listing from '../Classifieds/listing/Listing';
import MyListings from '../Classifieds/MyListings/MyListings';
import CreateListing from '../Classifieds/create/CreateListing';
import Messages from '../Users/messages/Messages/Messages';
import MessageDisplay from '../Users/messages/DisplayMessage/MessageDisplay';
import MessageReply from '../Users/messages/Reply/MessageReply';
import SellerContactForm from '../Classifieds/SellerContactForm';
import Success from '../../_functions/Success';
import Contact from '../contact/Contact';
import SellersOtherListings from '../Classifieds/SellersListings/SellersListings';
import NewVendor from '../VendorList/NewVendor/NewVendor';

const Pages = () => {
	return (
		<React.Fragment>
			<Route exact path="/" component={Welcome} />
			<Route path="/classifieds" component={Categories} />
			<Route path="/vendors" component={Vendors} />
			<Route path="/sub_category/:id/" component={SubCategories} />
			<Route path="/login" component={Login} />
			<Route path="/register" component={Register} />
			<Route path="/my_profile" component={EditProfile} />
			<Route path="/listing/:id" component={Listing} />
			<Route path="/my_classifieds" component={MyListings} />
			<Route path="/create_classified" component={CreateListing} />
			<Route path="/messages" component={Messages} />
			<Route path="/message-display" component={MessageDisplay} />
			<Route path="/message-reply" component={MessageReply} />
			<Route path="/message-seller" component={SellerContactForm} />
			<Route path="/success/:refer" component={Success} />
			<Route path="/contact" component={Contact} />
			<Route path="/sellers-listings/:id" component={SellersOtherListings} />
			<Route path="/add_vendor" component={NewVendor} />
		</React.Fragment>
	);
};

export default Pages;
