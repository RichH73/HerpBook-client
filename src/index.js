import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import allReducers from './reducers';
//import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { store_config } from './reducers/config';

export const store = createStore(
	allReducers,
	store_config()
	// composeWithDevTools(applyMiddleware(thunk))
	//applyMiddleware(thunk)
);

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
);
