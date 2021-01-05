import React from 'react';
import { Route } from 'react-router-dom';

import Vendors from '../VendorList/Vendors';
import Categories from '../Classifieds/Categories/Categories';
import SubCategories from '../Classifieds/subcategories/SubCategories';
import Login from '../Users/Login/Login';
import Register from '../Users/Register/Register';
import Welcome from '../Welcome/Welcome';
import EditProfile from '../Users/Profile/Private/Edit/EditProfile';
import Listing from '../Classifieds/listing/Listing';
import MyListings from '../Classifieds/MyListings/MyListings';
import CreateListing from '../Classifieds/create/CreateListing';
import SellerContactForm from '../Users/Mail/SellerContact/SellerContactForm';
import Success from '../../_functions/Success';
import Contact from '../contact/Contact';
import SellersOtherListings from '../Classifieds/SellersListings/SellersListings';
import NewVendor from '../VendorList/NewVendor/NewVendor';
import Shame from '../Shame/Shame';
import FIleShame from '../Shame/FileReport/FileReport';
import ShameReport from '../Shame/ViewShame/ViewShame';
import MyCollections from '../Collections/MyCollections';
import Main from '../Collections/DisplayAnimal/Main';
import AddNewAnimal from '../Collections/AddNewAnimal/AddNewAnimal';
import GetMail from '../Users/Mail/GetMail/GetMail';
import AnimalSearch from '../Collections/DisplayAnimal/AnimalSearch';
import NewClutch from '../Clutches/NewClutch/NewClutch';
import PublicProfile from '../Users/Profile/Public/PublicProfile';
import Friends from '../Users/Profile/Public/Friends/Friends';
import Activity from '../Users/Profile/Public/Activity/Activity';
import Search from '../SiteSearch/SiteSearch';
import Clutches from '../Clutches/Clutches';
import EditClutch from '../Clutches/EditClutches/EditClutch';
import CollectionPublicView from '../Collections/PublicView/DisplayAnimal/CollectionPublicView';

const Pages = () => {
	return (
		<React.Fragment>
			<Route exact path="/" component={Welcome} />
			<Route path="/add_vendor" component={NewVendor} />
			<Route path="/classifieds" component={Categories} />
			<Route path="/contact" component={Contact} />
			<Route path="/create_classified" component={CreateListing} />
			<Route path="/listing/:id" component={Listing} />
			<Route path="/login" component={Login} />
			<Route path="/contact_seller" component={SellerContactForm} />
			<Route path="/my_mail" component={GetMail} />
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
			<Route path="/edit_animal/:id" component={Main} />
			<Route path="/new_collection" component={AddNewAnimal} />
			<Route path="/search_collections/:id" component={AnimalSearch} />
			<Route path="/new_clutch" component={NewClutch} />
			<Route path="/user/:id" component={PublicProfile} />
			<Route path="/user/:id/friends" component={Friends} />
			<Route path="/user/:id/activity" component={Activity} />
			<Route path="/search" component={Search} />
			<Route path="/clutches" component={Clutches} />
			<Route path="/view_animal/:id" component={CollectionPublicView} />
			{/* <Route path="/edit_clutch" component={EditClutch} /> */}
			<Route path="/edit_clutch/:id" component={EditClutch} />
		</React.Fragment>
	);
};

export default Pages;
