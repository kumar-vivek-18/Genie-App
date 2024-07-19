import io from 'socket.io-client';
import { baseUrl } from '../logics/constants';

export const socket = io(`${baseUrl}`);
// export const socket = io('http://192.168.85.192:5000/');
// export const socket = io('https://culturtap.com', {
//     transports: ['websocket']
// });


// console.log('socket ', socket);