import React from 'react';
import './Categories.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import * as actionCreators from '../../../../actions/index';

//Google analytics for visitor tracking
import ReactGA from 'react-ga';

class Categories extends React.Component {
	state = {
		categories: [],
	};

	componentDidMount() {
		ReactGA.pageview('/classifieds');
		this.props.setPageTitle('Classifieds');
	}

	getCount = async (cat) => {
		await axios({
			url: `${this.props.serverAPI}/listings/category_count2`,
			method: 'post',
			headers: {},
			data: {
				category: cat,
			},
		}).then((res) => {
			//console.log('the count', res.data.count)
			return <div>{res.data.count}</div>;
		});
	};

	SubListings = () => {
		var combined = (num) => {
			var subs = this.props.subCategories.filter((e) => e.category_id === num);
			var newSubs = subs.map((sb) => (
				<div key={sb.id} className="list-sub-category-link">
					<Link to={`sub_category/${sb.id}/`} key={sb.id}>
						{sb.name}
						<br />
					</Link>
				</div>
			));
			return newSubs;
		};
		var cats = this.props.categories.map((cat) => (
			<div key={cat.id} id={cat.name} className="list-containers">
				<div className="category-header">
					<b>{cat.name}</b>
				</div>
				<div className="list-sub-categories">{combined(cat.id)}</div>
			</div>
		));
		return <div className="category-container">{cats}</div>;
	};

	render() {
		return (
			<div>
				<div></div>
				<div className="categories">
					{this.props.subCategories ? <this.SubListings /> : ''}
					<div></div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	serverAPI: state.config.server.serverAPI,
	categories: state.categories.categories,
	subCategories: state.categories.subCategories,
	React: state.config.analytics,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
