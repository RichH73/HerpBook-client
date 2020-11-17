import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Activity.css';
import ReactToPrint from 'react-to-print';
import ToPrint from './PrintCards/ToPrint';

import dayjs from 'dayjs';
class Activity extends Component {
	state = {
		data: 'Not Found',
	};

	componentDidMount() {
		console.log(this.props);
	}

	render() {
		const fd = dayjs(this.props.currentAnimal.dob);
		return (
			<Tabs>
				<TabList>
					<Tab>Classifed settings</Tab>
					<Tab>ID Card</Tab>
				</TabList>
				<TabPanel>
					<div style={{ padding: '10px' }}>
						<h3>Coming Soon...</h3>
					</div>
				</TabPanel>
				<TabPanel>
					<div className="id-card-preview">
						<ToPrint ref={(el) => (this.componentRef = el)} />
					</div>
					<ReactToPrint
						trigger={() => {
							return (
								<a href="#">
									<button className="button" style={{ width: '120px', marginLeft: '20px' }}>
										Print ID Card
									</button>
								</a>
							);
						}}
						content={() => this.componentRef}
					/>
				</TabPanel>
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
	urlImg: state.bar_img.img,
	currentAnimal: state.viewAnimal,
	selectedAnimalId: state.selectedAnimal.id,
	collectionsIds: state.wholeCollection,
	recordOverlay: state.editRecord,
	notesText: state.richText.text,
	mods: state.richText,
	imgSrc: state.bar_img.img,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
