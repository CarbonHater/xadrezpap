// socket.js

import io from 'socket.io-client'

const URL = 'https://xadrezpap-backend.herokuapp.com/'

const socket = io(URL)

var mySocketId
// Registe event listeners preliminares aqui:

socket.on("createNewGame", statusUpdate => {
    mySocketId = statusUpdate.mySocketId
})

export {socket, mySocketId}
