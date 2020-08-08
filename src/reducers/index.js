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

const allReducers = combineReducers({
	states,
	Vendors,
	categories,
	config,
	pageId,
	user,
	imageHandler,
	user_profile,
	pictures,
	classified,
	user_posts,
	listing,
	messages,
	messageReply,
	richText,
	spinner,
});

export default allReducers;
