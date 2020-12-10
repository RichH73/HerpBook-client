import io from 'socket.io-client';
import serverStatus from '../../reducers/config';

const socket = io(serverStatus().server.serverSocket);

export default socket;

/*
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
