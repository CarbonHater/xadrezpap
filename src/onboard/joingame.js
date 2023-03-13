/*
* joingame.js
*
* joingame é onde realmente entramos na página de jogo
*/

// imports
import React from 'react'
import { useParams } from 'react-router-dom'
const socket  = require('../connection/socket').socket
const JoinGameRoom = (gameid, userName, isCreator) => {
    // Para esta instância do navegador, queremos juntá-lo a um gameRoom.
    const idData = {
        gameId : gameid,
        userName : userName,
        isCreator: isCreator
    }
    socket.emit("playerJoinGame", idData)
}
  
  
const JoinGame = (props) => {
    //Extraia o 'gameId' do URL. O 'gameId' é o ID do gameRoom.
    const { gameid } = useParams()
    JoinGameRoom(gameid, props.userName, props.isCreator)
    return <div>
        <h1 style = {{color: "snow", textAlign: "center"}}>Bem-vindo!</h1>
    </div>
}

export default JoinGame
  
