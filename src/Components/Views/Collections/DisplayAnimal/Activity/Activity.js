import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Activity.css';
import ReactToPrint from 'react-to-print';
import ToPrint from '../../../../_services/Print/PrintCards/ToPrint';
import Settings from './Settings/Settings';
//import dayjs from 'dayjs';
import PrintRecords from './Printing/PrintRecords';
import CollectionList from './Classified/CollectionList';

class Activity extends Component {
	state = {
		data: 'Not Found',
	};

	componentDidMount() {}

	render() {
		return (
			<Tabs>
				<TabList>
					<Tab>Classifed settings</Tab>
					<Tab>Printing</Tab>
					<Tab>Settings</Tab>
				</TabList>
				<TabPanel>
					<CollectionList />
				</TabPanel>
				<TabPanel>
					<Tabs>
						<TabList>
							<Tab>Print ID Card</Tab>
							<Tab>Print Records</Tab>
						</TabList>
						<TabPanel>
							<div className="id-card-preview">
								<ToPrint ref={(el) => (this.componentRef = el)} />
							</div>
							<ReactToPrint
								trigger={() => {
									return (
										//TODO review this a href ref
										// eslint-disable-next-line
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
						<TabPanel>
							<PrintRecords />
						</TabPanel>
					</Tabs>
				</TabPanel>
				<TabPanel>
					<Settings history={this.props.history} />
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
