import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import QRCode from 'qrcode';
import axios from 'axios';

const SmallCard = () => {
	const { _id, images, name, dob, gender } = useSelector((state) => state.viewAnimal);
	const firstImageThumb = `${images[0].URL}/${images[0].thumbnail}`;

	let code;
	let animalImage;
	console.log('this name?', !!name);
	const animalName = !!name ? `Name: ${name}` : '';
	const animalGender = !!gender ? `Gender: ${gender}` : '';
	const animalDob = !!dob ? `DOB: ${dayjs(dob).format('MMM DD, YYYY')}` : '';
	const qr = QRCode.toDataURL(`https://www.herpbook.com/view_animal?id=${_id}`).then((url) => (code = url));

	const imgDat = axios({
		url: `https://herpbook.com:8550/collections/report_image`,
		method: 'post',
		data: {
			collectionID: _id,
		},
	}).then((data) => {
		animalImage = `data:image/jpeg;base64, ${data.data}`;
	});

	const [image, setImage] = useState(null);
	const [qrImg, setQr] = useState(null);
	const canvas = useRef('testing');

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
			ctx.drawImage(image, 2, 2);
		}
		if (qrImg && canvas) {
			const ctx = canvas.current.getContext('2d');
			ctx.drawImage(qrImg, 230, 0, 110, 110);

			ctx.moveTo(0, 0);
			ctx.lineTo(450, 0);
			ctx.stroke();

			ctx.moveTo(400, 0);
			ctx.lineTo(400, 200);
			ctx.stroke();

			ctx.moveTo(400, 200);
			ctx.lineTo(0, 200);
			ctx.stroke();

			ctx.moveTo(0, 200);
			ctx.lineTo(0, 0);
			ctx.stroke();

			ctx.font = '12px Arial';
			ctx.fillStyle = 'black';
			ctx.fillText(_id, 205, 115);

			ctx.font = '18px Arial';
			ctx.fillStyle = 'black';
			ctx.fillText(animalName, 205, 150);

			ctx.font = '18px Arial';
			ctx.fillStyle = 'black';
			ctx.fillText(animalGender, 205, 170);

			ctx.font = '18px Arial';
			ctx.fillStyle = 'black';
			ctx.fillText(animalDob, 205, 190);
		}
	}, [[image, qrImg], canvas]);

	const styles = {
		outterDiv: {
			//width: '90%',
			margin: '1em auto',
			textAlign: 'center',
		},
	};
	return (
		<div>
			<canvas ref={canvas} width={400} height={200} />
		</div>
	);
};

export default SmallCard;
