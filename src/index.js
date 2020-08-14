import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
// eslint-disable-next-line
import { createStore, applyMiddleware } from 'redux';
import allReducers from './reducers';
//import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { store_config } from './reducers/config';
import { FacebookProvider } from 'react-facebook';

export const store = createStore(
	allReducers,
	store_config()
	// composeWithDevTools(applyMiddleware(thunk))
	//applyMiddleware(thunk)
);

ReactDOM.render(
	<Provider store={store}>
		<FacebookProvider appId="891710347959626">
		<BrowserRouter>
			<App />
		</BrowserRouter>
		</FacebookProvider>
	</Provider>,
	document.getElementById('root')
);
