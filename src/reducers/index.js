import { combineReducers } from 'redux';
import states from './states';
import Vendors from './vendors';
import categories from './categories';
import config from './config';
import pageId from './pageHeader';
import user from './user';
import imageHandler from './imageHandler';
import { user_profile } from './user_profile';
import { user_posts } from './user_profile';
import pictures from './user_albums';
import classified from './classified';
import listing from './listing';
import messages from './messages';
import messageReply from './messageReply';
import richText from './richText';
import { spinner, alertModal, bar_img, scanBarCode } from './tools';
import { subCategoryListings } from './classified';
import { viewAnimal, myCollections, selectedAnimal, createNewAnimal, myCollectionsFilters } from './collections';
import { wallOfShame, fileShameReport } from './wallOfShame';
import showFloatingImage from './floatingImage';
import editRecord from './editRecords';
import { new_clutch, current_clutch, my_clutches } from './clutches';
import my_listings from './my_listings';
import userMail from './userMail';

const allReducers = combineReducers({
	alertModal,
	bar_img,
	categories,
	classified,
	config,
	createNewAnimal,
	current_clutch,
	editRecord,
	fileShameReport,
	imageHandler,
	listing,
	messageReply,
	messages,
	my_clutches,
	my_listings,
	myCollections,
	myCollectionsFilters,
	new_clutch,
	pageId,
	pictures,
	richText,
	scanBarCode,
	selectedAnimal,
	showFloatingImage,
	spinner,
	states,
	subCategoryListings,
	user_posts,
	user_profile,
	user,
	userMail,
	Vendors,
	viewAnimal,
	wallOfShame,
});

export default allReducers;
