import React, { Component, useEffect, useState, useRef } from 'react';
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
import axios from 'axios';
import { useSelector } from 'react-redux';

//Bootstrap imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SmallCard = () => {
	const { _id, images, name, dob, gender } = useSelector((state) => state.viewAnimal);
	const firstImageThumb = `${images[0].URL}/${images[0].thumbnail}`;

	let code;
	let animalImage;
	const animalInfo = (`${_id}`, `${name} - ${gender} - ${dob}`);
	const qr = QRCode.toDataURL(`https://www.herpbook.com/view_animal?id=${_id}`).then((url) => (code = url));

	const imgDat = axios({
		url: `https://herpbook.com:8550/collections/report_image`,
		method: 'post',
		data: {
			collectionID: '5fb42a556ffd74344cc21b0d',
		},
	}).then((data) => {
		animalImage = `data:image/jpeg;base64, ${data.data}`;
	});

	const [image, setImage] = useState(null);
	const [qrImg, setQr] = useState(null);
	// const [qrImg, setImage] = useState(null)
	const canvas = useRef(null);

	useEffect(() => {
		const animalImg = new Image();
		const qrImg = new Image();
		qrImg.src = code;
		animalImg.src = firstImageThumb;
		animalImg.onload = () => setImage(animalImg);
		qrImg.onload = () => setQr(qrImg);
	}, []);

	useEffect(() => {
		if (image && qrImg && canvas) {
			const ctx = canvas.current.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, 450, 258);
			ctx.drawImage(image, 5, 5);
		}
		if (qrImg && canvas) {
			const ctx = canvas.current.getContext('2d');
			ctx.drawImage(qrImg, 300, 0, 130, 130);
			ctx.font = '18px Arial';
			ctx.fontColor = 'black';
			ctx.fillText(animalInfo, 5, 200);
		}
	}, [[image, qrImg], canvas]);

	return (
		<div>
			<canvas ref={canvas} width={450} height={258} />
			{/* <img src={Promise.all([getImage()]).then(res => {return res})} /> */}
		</div>
	);
};

export default SmallCard;

/*

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
		const animal = this.props.currentAnimal;
		return (
			<React.Fragment>

				<canvas
				ref={canvas}
				id="myCanvas"
				width={450}
				height={258}
				/>
				<div className="bar-code-body">
					<Container>
						<Row xs={3} md={3} lg={3}>
							<Col>
								<img src={`${animal.images[0].URL}/${animal.images[0].thumbnail}`} alt=""/>
							</Col>
							<Col></Col>
							<Col>
								<img src={this.props.imgSrc} alt="" style={{width: '7em'}} />
							</Col>
						</Row>
						<Row xs={3} md={3} lg={3}>
							<Col>{!!animal.name ? <h4>{animal.name}</h4> : ''}</Col>
							<Col><p>Gender: {animal.gender}</p></Col>
							<Col>{!!animal.dob ? <span>DOB: {dayjs(animal.dob).format('MM/DD/YYYY')}</span> : ''}</Col>
						</Row>
					</Container>
				</div>
				<div>
				<div className="card-body">
					<div className="bar-code-body">
						<div className="bar-code-img">
							<img src={`${animal.images[0].URL}/${animal.images[0].thumbnail}`} alt="" />
						</div>
						<div className="bar-code-name">
							<div className="bar-code">
								<img src={this.props.imgSrc} alt="" />
							</div>
							<div className="bar-code-inner-name">
								{!!animal.name ? <h4>{animal.name}</h4> : ''}
								<p>Gender: {animal.gender}</p>								
								{!!animal.dob ? <p>DOB: {dayjs(animal.dob).format('MM/DD/YYYY')}</p> : ''}
							</div>
						</div>
					</div>
				</div>
			</div>
			</React.Fragment>
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

*/
