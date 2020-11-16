import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../actions/index';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';

import moment from 'moment';

import QRCode from 'qrcode';

import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ReactGA from 'react-ga';

import BarcodeReader from 'react-barcode-reader';

class Activity extends Component {
	state = {
		data: 'Not Found',
	};

	componentDidMount() {
		this.qr();
		//React.createElement('img', {id: 'image', src: ''} )
	}

	qr = () => {
		QRCode.toDataURL('https://www.herpbook.com/listing/5f35a83776dc219948d7341e').then((url) => {
			this.props.barTest(url);
		});
	};

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
				<TabPanel>
					<img src={this.qr()} />
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
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
