import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Backdrop.css';
import { closeSideDrawer } from '../../../../actions';

const Backdrop = (props) => {
	const dispatch = useDispatch();
	const drawer = useSelector((state) => state.navDrawer);
	return <div className="backdrop" onClick={() => dispatch(closeSideDrawer())} />;
	// return <div className="backdrop" onClick={props.click} />;
};

export default Backdrop;
