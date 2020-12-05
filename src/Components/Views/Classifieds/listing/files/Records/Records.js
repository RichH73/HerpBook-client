import React from 'react';
import './Records.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
//import ReactGA from 'react-ga';
import dayjs from 'dayjs';

class Records extends React.Component {
	state = {};

	componentDidMount() {}

	setTitle = (title) => {};

	componentWillUnmount() {}

	feed = () => {
		if (!!this.props.classified_listing.records.feedings.length) {
			return (
				<div>
					<h4>Feed Records</h4>
					<table>
						<thead>
							<tr>
								<td>Date</td>
								<td>Feeder Type</td>
								<td>Feeder amount or weight</td>
							</tr>
						</thead>
						<tbody>
							{this.props.classified_listing.records.feedings.map((feed) => (
								<tr>
									<td>{dayjs(feed.date).format('MM/DD/YYYY')}</td>
									<td>{feed.feederType}</td>
									<td>{feed.feederWeight}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		}
	};

	weight = () => {
		if (!!this.props.classified_listing.records.weights.length) {
			return (
				<div>
					<h4>Weight Records</h4>
					<table>
						<thead>
							<tr>
								<td>Date</td>
								<td>Weight</td>
							</tr>
						</thead>
						<tbody>
							{this.props.classified_listing.records.weights.map((weight) => (
								<tr>
									<td>{dayjs(weight.date).format('MM/DD/YYYY')}</td>
									<td>
										{weight.weight}
										{weight.weightUnit}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		}
	};

	shed = () => {
		if (!!this.props.classified_listing.records.sheddings.length) {
			return (
				<div>
					<h4>Shed Records</h4>
					<table>
						<thead>
							<tr>
								<td>Date</td>
								<td>Complete Shed</td>
							</tr>
						</thead>
						<tbody>
							{this.props.classified_listing.records.sheddings.map((shed) => (
								<tr>
									<td>{dayjs(shed.date).format('MM/DD/YYYY')}</td>
									{!!shed.fullShed ? <td>Yes</td> : <td>No</td>}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		}
	};

	pair = () => {
		if (!!this.props.classified_listing.records.pairings.length) {
			return (
				<div>
					<h4>Pair Records</h4>
					<table>
						<thead>
							<tr>
								<td>Date</td>
								<td>Mate</td>
								<td>Whitnessed</td>
								<td>Successfull</td>
							</tr>
						</thead>
						<tbody>
							{this.props.classified_listing.records.pairings.map((pair) => (
								<tr>
									<td>{dayjs(pair.date).format('MM/DD/YYYY')}</td>
									<td>{pair.mate}</td>
									{!!pair.whitnessed ? <td>Yes</td> : <td>No</td>}
									{!!pair.successful ? <td>Yes</td> : <td>No</td>}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		}
	};

	render() {
		return (
			<div className="classified-listing-animal-records">
				{this.feed()}
				{this.weight()}
				{this.shed()}
				{this.pair()}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	uid: state.user_profile.uid,
	username: state.user_profile.username,
	albums: state.pictures.albums,
	thumbnails: state.classified.listData.images.thumbnail,
	//loading: state.loader.loading,
	visitor_get_username: state.classified.listData.username,
	listTitle: state.classified.listData.title,
	classified_listing: state.classified.listData,
	images: state.classified.listData.images,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Records);
