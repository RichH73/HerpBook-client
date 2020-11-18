import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
import dayjs from 'dayjs';
import _ from 'lodash';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class PrintRecords extends Component {
	state = {
		data: '',
	};

	componentDidMount() {
		// const pdfDocGenerator = pdfMake.createPdf(docDefinition);
		//   pdfDocGenerator.getBase64((data) => {
		//     this.setState({data: data});
		//   });
	}

	createPdf = () => {
		let feedArray = [];
		let header = ['Date', 'Feeder Type', 'Feeder amount or weight'];
		feedArray.push(header);
		this.props.currentAnimal.feedings.map((feed) => {
			let fd = dayjs(_.get(feed, 'date'));
			feedArray.push([`${fd.$M + 1}/${fd.$D}/${fd.$y}`, feed.feederType, feed.feederWeight]);
		});
		console.log('feeds', feedArray);
		var docDefinition = {
			content: [
				{ text: 'Feeding Records', style: 'header' },
				{
					style: 'tableExample',
					//layout: 'lightHorizontalLines',
					table: {
						//headerRows: 1,
						widths: ['auto', 'auto', 'auto'],
						body: [feedArray],
					},
				},
			],
			styles: {
				header: {
					fontSize: 18,
					bold: true,
					margin: [0, 0, 0, 10],
				},
				subheader: {
					fontSize: 16,
					bold: true,
					margin: [0, 10, 0, 5],
				},
				tableExample: {
					margin: [0, 5, 0, 15],
				},
				tableHeader: {
					bold: true,
					fontSize: 13,
					color: 'black',
				},
			},
		};

		// const pdfDocGenerator = pdfMake.createPdf(this.docDefinition);
		// pdfDocGenerator.getBase64((data) => {
		//   this.setState({data: data});
		// });
		return pdfMake.createPdf(docDefinition).open({}, window.open('', '_blank'));
		// return feedMappings()
		// return pdfMake.createPdf(docDefinition).print();
	};

	render() {
		console.log(this.createPdf());
		return (
			<div>
				<button onClick={this.createPdf}>Make</button>
			</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PrintRecords);
