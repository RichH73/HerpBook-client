import io from 'socket.io-client';
import serverStatus from '../../reducers/config';
import { Base64 } from 'js-base64';

const socket = io(serverStatus().server.serverSocket);

if (localStorage.token) {
	const user = localStorage.token ? JSON.parse(Base64.decode(localStorage.token.split('.')[1])) : '';
	socket.on('connect', () => {
		socket.emit('newUser', {
			uid: user.uid,
			authToken: localStorage.token,
		});
	});
	socket.emit('mail', {
		eventType: 'checkMail',
		authToken: localStorage.token,
		uid: user.uid,
	});
}
console.log(io);

export const setSocketID = (userData) => {
	if (!!userData.uid && !userData.socketId) {
		socket.emit('newUser', {
			uid: userData.uid,
			authToken: localStorage.token,
		});
	}
	if (!!userData.uid && userData.socketId) {
		socket.on('downloadNewMail', (mailData) => {
			console.log('email download tripped', mailData);
			// this.props.newUserMail({
			// 	mailCount: mailData.inbox.filter((count) => !count.seen).length,
			// 	inbox: mailData.inbox,
			// 	sentItmes: mailData.sentItems,
			// });
		});
	}
};

socket.on('disconnect', (data) => {
	console.log('disconnect data', socket.removeAllListeners());
	socket.off('downloadNewMail');
	socket.removeAllListeners();
	// io.sockets.removeListener('connect', data => {
	// 	console.log(data)
	// });
});

export default socket;

/*
		const openSocket = () => {
			if (!!this.props.userInfo.socketId) {
				return;
			}
			socket.on('connect', () => {
				// socket.emit('newUser', {
				// 	uid: this.props.userUid,
				// 	authToken: localStorage.token,
				// });
			});
			//   socket.emit("mail", {
			// 	eventType: "checkMail",
			// 	uid: this.props.userInfo.uid,
			// 	authToken: localStorage.token,
			//   });
			socket.on('downloadNewMail', (mailData) => {
				this.props.newUserMail({
					mailCount: mailData.inbox.filter((count) => !count.seen).length,
					inbox: mailData.inbox,
					sentItmes: mailData.sentItems,
				});
			});
		};
		if (!!this.props.userInfo.uid) {
			openSocket();
		}








businessCity: "Tampa"
businessName: "Herpbook Classifieds"
businessPhone: "+1 (813) 555-1232"
businessState: "Florida"
businessStreet: "4323 S. Culver Ter"
businessZip: "34452"
displayEntityEmail: true
displayEntityPhone: false
display_address: true
entityCity: "Inverenss"
entityEmail: "rich@richthats.me"
entityEmailType: "HOME"
entityPhoneNumber: "+1 (352) 423-4653"
entityPhoneType: "HOME"
entityState: "Florida"
entityStreet: "4323 S. Culver Ter"
entityZip: "34452"
exp: 1607870868
firstName: "Richard"
iat: 1607438868
is_this_a_business: true
lastName: "Howell"
profile_pic: "small_rack_pvc.jpg"
uid: "5e2cd47915ef5c7e07b11adc"
username: "rich"
website: "http://www.herpbook.com"
*/
