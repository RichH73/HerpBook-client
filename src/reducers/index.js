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
import { spinner } from './tools';
import { subCategoryListings } from './classified';
import wallOfShame from './wallOfShame';

const allReducers = combineReducers({
	categories,
	classified,
	config,
	imageHandler,
	listing,
	messageReply,
	messages,
	pageId,
	pictures,
	richText,
	spinner,
	states,
	subCategoryListings,
	user_posts,
	user_profile,
	user,
	Vendors,
	wallOfShame,
});

export default allReducers;
