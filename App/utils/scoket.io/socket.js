import io from 'socket.io-client';
import { baseUrl } from '../logics/constants';

export const socket = io(`http://173.212.193.109:5000`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: Infinity,
    reconnectionDelayMax: 1000,
    transports: ['websocket'],
});
// export const socket = io('http://192.168.85.192:5000/');
// export const socket = io('https://culturtap.com', {
//     transports: ['websocket']
// });


// console.log('socket ', socket);