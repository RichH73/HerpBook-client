import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';

import BarcodeReader from 'react-barcode-reader';

class Activity extends Component {
	state = {
		data: 'Not Found',
	};

	componentDidMount() {}

	handleDate = (date) => {
		console.log(date);
	};

	render() {
		return (
			<Tabs>
				<TabList>
					<Tab>Feeding</Tab>
					<Tab>Pairing</Tab>
					<Tab>Shed</Tab>
					<Tab>Cleaning</Tab>
				</TabList>
				<TabPanel>Feeding</TabPanel>
				<TabPanel>Pairing</TabPanel>
				<TabPanel>Shed</TabPanel>
				<TabPanel>Cleaning</TabPanel>
			</Tabs>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	userInfo: state.user,
	React: state.config.analytics,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Activity);

/*
			<div className="collections-create-new-activity">
				<div className="collections-create-new-activity-type">
					<label>Activity Type:</label>
					<div>
						<select>
							<option>Shedding</option>
							<option>Feeding</option>
							<option>Pairing</option>
							<option>Cage Cleaning</option>
						</select>
					</div>
				</div>
				<div className="collections-create-new-activity-date">
					<DatePicker
						allowSameDay={true}
						dateFormat="dd/MM/yyyy"
						showTimeSelect={false}
						title="Activity Date"
						closeOnScroll={false}
						locale="en-US"
						dateFormat="yyy/MM/dd"
						placeholderText="Click to select date"
						//   isClearable
						//   placeholderText="I have been cleared!"
						showPopperArrow={false}
						onChange={this.handleDate}
					/>
				</div>
			</div>

*/
