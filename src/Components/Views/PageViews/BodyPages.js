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
import MailDisplay from '../Users/Mail/DisplayMailMessage/MailDisplay';
import MessageReply from '../Users/messages/Reply/MessageReply';
import SellerContactForm from '../Users/Mail/SellerContact/SellerContactForm';
// import SellerContactForm from '../Classifieds/SellerContactForm';
import Success from '../../_functions/Success';
import Contact from '../contact/Contact';
import SellersOtherListings from '../Classifieds/SellersListings/SellersListings';
import NewVendor from '../VendorList/NewVendor/NewVendor';
import Shame from '../Shame/Shame';
import FIleShame from '../Shame/FileReport/FileReport';
import ShameReport from '../Shame/ViewShame/ViewShame';
import MyCollections from '../Collections/MyCollections';
import Main from '../Collections/DisplayAnimal/Main';
import AddNewAnimal from '../Collections/AddNewAnimal';
import GetMail from '../Users/Mail/GetMail/GetMail';
//TODO what is this??
//import SearchCollections from '../Collections/DisplayAnimal/AnimalSearch';
import AnimalSearch from '../Collections/DisplayAnimal/AnimalSearch';
import NewClutch from '../Clutches/NewClutch/NewClutch';
import MailReply from '../Users/Mail/MailReply/MailReply';
const Pages = (props) => {
	return (
		<React.Fragment>
			<Route exact path="/" render={(props) => <Welcome {...props} title={`Props through render`} />} />
			<Route path="/add_vendor" component={NewVendor} />
			<Route path="/classifieds" component={Categories} />
			<Route path="/contact" component={Contact} />
			<Route path="/create_classified" component={CreateListing} />
			<Route path="/listing/:id" component={Listing} />
			<Route path="/login" component={Login} />
			<Route path="/message-display" component={MessageDisplay} />
			<Route path="/message-reply" component={MessageReply} />
			<Route path="/contact_seller" component={SellerContactForm} />
			<Route path="/messages" component={Messages} />
			<Route path="/my_mail" component={GetMail} />
			<Route path="/read_mail" component={MailDisplay} />
			<Route path="/mail_reply" component={MailReply} />
			<Route path="/my_classifieds" component={MyListings} />
			<Route path="/my_profile" component={EditProfile} />
			<Route path="/register" component={Register} />
			<Route path="/sellers-listings/:id" component={SellersOtherListings} />
			<Route path="/sub_category/:id/" component={SubCategories} />
			<Route path="/success/:refer" component={Success} />
			<Route path="/vendors" component={Vendors} />
			<Route path="/shames" component={Shame} />
			<Route path="/file_report" component={FIleShame} />
			<Route path="/view_shame" component={ShameReport} />
			<Route path="/my_collections" component={MyCollections} />
			<Route path="/view_animal" component={Main} />
			<Route path="/new_collection" component={AddNewAnimal} />
			<Route path="/search_collections/:id" component={AnimalSearch} />
			<Route path="/new_clutch" component={NewClutch} />
		</React.Fragment>
	);
};

export default Pages;
