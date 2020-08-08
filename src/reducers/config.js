// eslint-disable-next-line
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const server_state = false;
//const redux = false;
const origins = ['http://localhost:3000', 'http://localhost:4000'];

export const server_status = () => {
	if (server_state === false) {
		return {
			serverAPI: 'http://localhost:8550',
			serverURL: 'htts://www.herpbook.com',
			usersURL: 'http://users.herpbook.com',
		};
	}
	return {
		serverAPI: 'https://herpbook.com:8550',
		serverURL: 'https://www.herpbook.com',
		usersURL: 'https://users.herpbook.com',
	};
};

const analytics = () => {
	if (origins.includes(window.origin)) {
		return false;
	}
	return true;
};

export const store_config = () => {
	if (origins.includes(window.origin)) {
		return composeWithDevTools(applyMiddleware(thunk));
	}
	return applyMiddleware(thunk);
};


const modules = {
	home_page_posts: false,
	daily_pic: false,
	imageGalleries: false,
	collections: false,
};

const config = () => {
	return {
		server: server_status(),
		modules: modules,
		store: store_config(),
		analytics: analytics(),
	};
};

export default config;
