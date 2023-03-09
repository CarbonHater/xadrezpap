// socket.js

import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL);

var mySocketId
// Registe event listeners preliminares aqui:

socket.on("createNewGame", statusUpdate => {
    mySocketId = statusUpdate.mySocketId
})

export {socket, mySocketId}
