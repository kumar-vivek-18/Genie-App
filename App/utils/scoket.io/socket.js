import io from 'socket.io-client';
import { baseUrl } from '../logics/constants';

export const socket = io(`${baseUrl}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: Infinity,
    reconnectionDelayMax: 1000
});
// export const socket = io('http://192.168.85.192:5000/');
// export const socket = io('https://culturtap.com', {
//     transports: ['websocket']
// });


// console.log('socket ', socket);