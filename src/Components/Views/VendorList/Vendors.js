import React, { Component } from 'react';
import './Vendors.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import ReactGA from 'react-ga';

class Vendors extends Component {
	state = {
		breeders_list: [],
		sub_categories: {},
	};

	componentDidMount() {
		if (!!this.props.React) {
			ReactGA.pageview('/vendors');
		}
		this.props.setPageTitle('Vendors');
	}

	componentWillUnmount() {
		//ReactGA.pageview('/breeders');
	}

	change_handler = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	breeders_search = () => {
		let list = this.props.breeders_list;
		if (this.state.state) {
			list = list.filter(
				(list) => _.includes(list.state, this.state.state)
				//commented out for now, plan to set up a word search later.
				// includes(list.state, this.state.filter) ||
				// includes(list.about, this.state.filter) ||
				// includes(list.business_name, this.state.filter) ||
				// includes(list.projects, this.state.filter) ||
				// includes(get(list, 'projects'), this.state.filter) ||
				// includes(list, this.state.filter)
			);
		}

		return list.map((breeder) => (
			<div className="breeder" key={breeder._id}>
				<div>
					<h4>{breeder.business_name}</h4>
				</div>
				<div>
					{breeder.projects.length > 0 ? <b>Projects/Supplies:</b> : ''}
					<ul>
						{_.get(breeder, 'projects').map((project) => (
							<li>{project}</li>
						))}
					</ul>
				</div>
				<div className="about">
					<b>About:</b> <p>{breeder.about}</p>
				</div>
				<div>
					<div>
						<b>Location:</b> {breeder.state}
					</div>
					<div>
						<b>Zip Code:</b> {breeder.zip_code}
					</div>
				</div>
				<div style={{ marginTop: '.5em' }}>
					<b>
						Contact:
						<br />
					</b>
					<a href={breeder.website} target="new">
						{breeder.website}
					</a>
				</div>
				<div>
					<a href={`mailto: ${breeder.email}`}>{breeder.email}</a>
				</div>
				{breeder.phone ? breeder.phone : ''}
			</div>
		));
	};

	render() {
		return (
			<div className="breeders-list">
				<h5>
					Would you like to add your business to this list? Do it <Link to="/add_vendor">Here</Link>.
				</h5>
				<p>Listings for breeders and vendors.</p>
				{/* Filter: <input type='text' name='filter' onChange={this.change_handler}/> */}
				List by State:{' '}
				<select name="state" onChange={this.change_handler}>
					<option></option>
					{this.props.states.map((state) => (
						<option value={state}>{state}</option>
					))}
				</select>
				<this.breeders_search />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	//uid: state.user.uid,
	//sub_categories: state.categories.sub_categories,
	breeders_list: state.Vendors.breeders || [],
	states: state.states,
	React: state.config.analytics,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Vendors);
