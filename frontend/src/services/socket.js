import { io } from "socket.io-client";

// adjust the URL if backend runs on a different host/port
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true
});

export default socket;