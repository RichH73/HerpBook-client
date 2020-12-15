import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-tabs/style/react-tabs.css';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import './PrintCards.css';
import dayjs from 'dayjs';
import QRCode from 'qrcode';

class SmallCard extends Component {
	state = {
		data: 'Not Found',
	};

	componentDidMount() {
		this.qr();
		//React.createElement('img', {id: 'image', src: ''} )
	}

	qr = () => {
		QRCode.toDataURL(`https://www.herpbook.com/view_animal?id=${this.props.currentAnimal._id}`).then((url) => {
			this.props.barTest(url);
		});
	};

	render() {
		const fd = dayjs(this.props.currentAnimal.dob);
		return (
			<div>
				<div className="card-body">
					<div className="bar-code-body">
						<div className="bar-code-img">
							<img src={`${this.props.currentAnimal.images[0].URL}/${this.props.currentAnimal.images[0].thumbnail}`} alt="" />
						</div>
						<div className="bar-code-name">
							<div className="bar-code">
								<img src={this.props.imgSrc} alt="" />
							</div>
							<div className="bar-code-inner-name">
								<h3>{this.props.currentAnimal.name}</h3>
								<p>Gender: {this.props.currentAnimal.gender}</p>
								<p>DOB: {`${fd.$M + 1}/${fd.$D}/${fd.$y}`}</p>
							</div>
						</div>
					</div>
				</div>
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
	collectionsIds: state.myCollections,
	recordOverlay: state.editRecord,
	notesText: state.richText.text,
	mods: state.richText,
	imgSrc: state.bar_img.img,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SmallCard);
