import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sideDrawerOpen } from '../../../actions';

import './DrawerToggleButton.css';

const dispatch = useDispatch();

const onClickHandler = () => {
	console.log('this clicked');
	dispatch(sideDrawerOpen());
};

const drawerToggleButton = (props) => (
	<button className="toggle-button" onLoad={onClickHandler()} onClick={() => onClickHandler()}>
		{console.log('function props', props)}
		<div className="toggle-button__line" />
		<div className="toggle-button__line" />
		<div className="toggle-button__line" />
	</button>
);

export default drawerToggleButton;
