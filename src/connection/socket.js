// socket.js

import io from 'socket.io-client'

const socket = io("http://localhost:8000");

var mySocketId
// Registe event listeners preliminares aqui:

socket.on('connection', () => {
    console.log("new client connected")
})

socket.on("createNewGame", statusUpdate => {
    mySocketId = statusUpdate.mySocketId
})

export {socket, mySocketId}
