import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './Toolbar.css';
import DrawerToggleButton from './drawerToggleButton';

class Toolbar extends React.Component {
	// const Toolbar = props => (
	// <header className="toolbar">
	render() {
		return (
			<nav className="toolbar__navigation">
				<div>
					<DrawerToggleButton click={this.props.drawerClickHandler} />
				</div>
				<div className="spacer" />
				<div className="toolbar_navigation-items">
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/breeders">Breeders/Vendors</Link>
						</li>
						<li>
							<Link to="/classifieds">Classifieds</Link>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}
const mapStateToProps = (state) => ({
	loggedInUser: state.userLoggedIn,
});

export default connect(mapStateToProps)(Toolbar);
