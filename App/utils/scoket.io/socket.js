import io from 'socket.io-client';

export const socket = io('http://173.212.193.109:5000/');

// export const socket = io('https://culturtap.com/api/');
// const socket = io('ttps://173.212.193.109:5000', {
//     path: '/socket.io',
//     ithCredentials: true,
//     transports: ['websocket'],
//     secure: true,
// });

// const socket = io('https://173.212.193.109:5000', {
//     withCredentials: true,
//     transports: ['websocket']
// });

// const socket = io('https://localhost:5000', {
//     withCredentials: true,  // Ensure credentials are sent
//     transports: ['websocket']  // Use websocket transport
// });
// export const socket = io('http://192.168.237.192:5000/');

// const socket = io('https://culturtap.com', {
// secure: true,
// transports: ['websocket', 'polling']
// });
console.log('socket ', socket);