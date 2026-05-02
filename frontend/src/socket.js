import { io } from "socket.io-client";

// Backend runs on port 5000
const SOCKET_URL = "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
