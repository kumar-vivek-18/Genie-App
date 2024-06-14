import io from 'socket.io-client';

export const socket = io('http://173.212.193.109:5000/');

// export const socket = io('https://culturtap.com/api/');
// export const socket = io('https://culturtap.com/api', {
//     path: '/api/socket.io',
//     transports: ['websocket', 'polling'],
//     secure: true
// });
// export const socket = io('http://192.168.237.192:5000/');