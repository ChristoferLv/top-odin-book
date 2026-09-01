import { io } from 'socket.io-client';

const socketIO = io("http://localhost:3000", {
  autoConnect: false
});

export default socketIO;