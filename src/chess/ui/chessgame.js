// chessgame.js

// imports necessários para o jogo de xadrez
import React from 'react'
import Game from '../model/chess'
import Square from '../model/square'
import { Stage, Layer } from 'react-konva';
import Board from '../assets/chessBoard.png'
import useSound from 'use-sound'
import chessMove from '../assets/moveSoundEffect.mp3'
import Piece from './piece'
import piecemap from './piecemap'
import { useParams } from 'react-router-dom'
import { ColorContext } from '../../context/colorcontext' 

// socket.io
const socket  = require('../../connection/socket').socket

class ChessGame extends React.Component {

    /*
    * A classe Jogo de Xadrez estende "React.Component" e representa um jogo de xadrez.
    * Tem informações sobre o estado atual do jogo: 
    * - qual peça está sendo arrastada
    * - de quem é a vez de mover 
    * - se o rei branco ou preto está em xeque.
    * 
    * Também escuta eventos de um websocket e atualiza o estado do jogo quando recebe uma jogada do oponente.
    * 
    * A classe tem funções para iniciar e terminar o arrasto de uma peça, para mover uma peça e para reverter o estado para o anterior se uma jogada inválida for feita.
    * Também atualiza o estado do jogo e verifica se o jogo acabou.
    * 
    * O estado do jogo é atualizado com os resultados de uma jogada e informações sobre xeque e xeque-mate.
    */    

    state = {
        gameState: new Game(this.props.color),
        // string vazia significa que nenhuma peça está sendo arrastada
        draggedPieceTargetId: "",
        playerTurnToMoveIsWhite: true,
        whiteKingInCheck: false, 
        blackKingInCheck: false
    }


    componentDidMount() {
        // regista event listeners
        socket.on('opponent move', move => {
            // move == [pieceId, finalPosition]
            if (move.playerColorThatJustMovedIsWhite !== this.props.color) {
                this.movePiece(move.selectedId, move.finalPosition, this.state.gameState, false)
                this.setState({
                    playerTurnToMoveIsWhite: !move.playerColorThatJustMovedIsWhite
                })
            }
        })
    }

    startDragging = (e) => {
        this.setState({
            draggedPieceTargetId: e.target.attrs.id
        })
    }


    movePiece = (selectedId, finalPosition, currentGame, isMyMove) => {
        /*
        * "update" é a conexão entre o modelo e a interface do utilizador.
        * Isto também pode ser uma solicitação HTTP e a "update" pode ser a resposta do servidor.
        * (o modelo esta host no servidor em vez do navegador)
        */
        var whiteKingInCheck = false 
        var blackKingInCheck = false
        var blackCheckmated = false 
        var whiteCheckmated = false
        const update = currentGame.movePiece(selectedId, finalPosition, isMyMove)
        
        if (update === "moved in the same position.") {
            // passe o ID selecionado para identificar a peça que fez um movimento inválido
            this.revertToPreviousState(selectedId)
            return
        } else if (update === "user tried to capture their own piece") {
            this.revertToPreviousState(selectedId) 
            return
        } else if (update === "b is in check" || update === "w is in check") { 
            // mude o preenchimento do rei enemigo ou do seu rei com base em qual lado está em xeque.
            if (update[0] === "b") {
                blackKingInCheck = true
            } else {
                whiteKingInCheck = true
            }
        } else if (update === "b has been checkmated" || update === "w has been checkmated") { 
            if (update[0] === "b") {
                blackCheckmated = true
            } else {
                whiteCheckmated = true
            }
        } else if (update === "invalid move") {
            this.revertToPreviousState(selectedId) 
            return
        } 

        // permite que o servidor e o outro cliente saibam o que jogo
        if (isMyMove) {
            socket.emit('new move', {
                nextPlayerColorToMove: !this.state.gameState.thisPlayersColorIsWhite,
                playerColorThatJustMovedIsWhite: this.state.gameState.thisPlayersColorIsWhite,
                selectedId: selectedId, 
                finalPosition: finalPosition,
                gameId: this.props.gameId
            })
        }
        

        this.props.playAudio()   
        // define o novo estado do jogo. 
        this.setState({
            draggedPieceTargetId: "",
            gameState: currentGame,
            playerTurnToMoveIsWhite: !this.props.color,
            whiteKingInCheck: whiteKingInCheck,
            blackKingInCheck: blackKingInCheck
        })

        if (blackCheckmated) {
            alert("BRANCO GANHOU POR XEQUE-MATE!")
        } else if (whiteCheckmated) {
            alert("PRETO GANHOU POR XEQUE-MATE!")
        }
    }


    endDragging = (e) => {
        const currentGame = this.state.gameState
        const currentBoard = currentGame.getBoard()
        const finalPosition = this.inferCoord(e.target.x() + 90, e.target.y() + 90, currentBoard)
        const selectedId = this.state.draggedPieceTargetId
        this.movePiece(selectedId, finalPosition, currentGame, true)
    }

    revertToPreviousState = (selectedId) => {
        // Deve atualizar a interface do utilizador para a aparência anterior da placa.
        const oldGS = this.state.gameState
        const oldBoard = oldGS.getBoard()
        const tmpGS = new Game(true)
        const tmpBoard = []

        for (var i = 0; i < 8; i++) {
            tmpBoard.push([])
            for (var j = 0; j < 8; j++) {
                if (oldBoard[i][j].getPieceIdOnThisSquare() === selectedId) {
                    tmpBoard[i].push(new Square(j, i, null, oldBoard[i][j].canvasCoord))
                } else {
                    tmpBoard[i].push(oldBoard[i][j])
                }
            }
        }
        // remove temporariamente a peça que acabou de ser movida
        tmpGS.setBoard(tmpBoard)

        this.setState({
            gameState: tmpGS,
            draggedPieceTargetId: "",
        })

        this.setState({
            gameState: oldGS,
        })
    }

 
    inferCoord = (x, y, chessBoard) => {
        // Deve dar a estimativa mais próxima para a nova posição.
        var hashmap = {}
        var shortestDistance = Infinity
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                const canvasCoord = chessBoard[i][j].getCanvasCoord()
                // calcular distancia
                const delta_x = canvasCoord[0] - x 
                const delta_y = canvasCoord[1] - y
                const newDistance = Math.sqrt(delta_x**2 + delta_y**2)
                hashmap[newDistance] = canvasCoord
                if (newDistance < shortestDistance) {
                    shortestDistance = newDistance
                }
            }
        }

        return hashmap[shortestDistance]
    }
   
    render() { 
        // Observe o estado atual do jogo no modelo e preencha a Interface Utilizador de acordo
        return (
        <React.Fragment>
        <div style = {{
            backgroundImage: `url(${Board})`,
            width: "720px",
            height: "720px"}}
        >
            <Stage width = {720} height = {720}>
                <Layer>
                {this.state.gameState.getBoard().map((row) => {
                        return (<React.Fragment>
                                {row.map((square) => {
                                    if (square.isOccupied()) {                                    
                                        return (
                                            <Piece 
                                                x = {square.getCanvasCoord()[0]}
                                                y = {square.getCanvasCoord()[1]} 
                                                imgurls = {piecemap[square.getPiece().name]}
                                                isWhite = {square.getPiece().color === "white"}
                                                draggedPieceTargetId = {this.state.draggedPieceTargetId}
                                                onDragStart = {this.startDragging}
                                                onDragEnd = {this.endDragging}
                                                id = {square.getPieceIdOnThisSquare()}
                                                thisPlayersColorIsWhite = {this.props.color}
                                                playerTurnToMoveIsWhite = {this.state.playerTurnToMoveIsWhite}
                                                whiteKingInCheck = {this.state.whiteKingInCheck}
                                                blackKingInCheck = {this.state.blackKingInCheck}
                                                />)
                                    }
                                    return
                                })}
                            </React.Fragment>)
                    })}
                </Layer>
            </Stage>
        </div>
        </React.Fragment>)
    }
}



const ChessGameWrapper = (props) => {
    // obtenha o gameId da URL aqui e passe-o para o componente chessGame como um "prop".
    const domainName = 'http://localhost:3000'
    const color = React.useContext(ColorContext)
    const { gameid } = useParams()
    const [play] = useSound(chessMove);
    const [opponentSocketId, setOpponentSocketId] = React.useState('')
    const [opponentDidJoinTheGame, didJoinGame] = React.useState(false)
    const [opponentUserName, setUserName] = React.useState('')
    const [gameSessionDoesNotExist, doesntExist] = React.useState(false)

    React.useEffect(() => {
        socket.on("playerJoinedRoom", statusUpdate => {
            if (socket.id !== statusUpdate.mySocketId) {
                setOpponentSocketId(statusUpdate.mySocketId)
            }
        })
    
        socket.on("status", statusUpdate => {
            alert(statusUpdate)
            if (statusUpdate === 'Esta sessão de jogo não existe.' || statusUpdate === 'Já há 2 pessoas a jogar nesta sala.') {
                doesntExist(true)
            }
        })
        
    
        socket.on('start game', (opponentUserName) => {
            if (opponentUserName !== props.myUserName) {
                setUserName(opponentUserName)
                didJoinGame(true) 
            } else {
                // in chessGame, pass opponentUserName as a prop and label it as the enemy. 
                // in chessGame, use reactContext to get your own userName
                // socket.emit('myUserName')
                socket.emit('request username', gameid)
            }
        })
    
    
        socket.on('give userName', (socketId) => {
            if (socket.id !== socketId) {
                socket.emit('recieved userName', {userName: props.myUserName, gameId: gameid})
            }
        })
    
        socket.on('get Opponent UserName', (data) => {
            if (socket.id !== data.socketId) {
                setUserName(data.userName)
                setOpponentSocketId(data.socketId)
                didJoinGame(true) 
            }
        })
    }, [])


    return (
      <React.Fragment>
        {opponentDidJoinTheGame ? (
          <div style={{marginLeft: "600px"}}>
            <h4 style={{color: "snow"}}> Adversário: {opponentUserName} </h4>
            <div style={{ display: "flex" }}>
              <ChessGame
                playAudio={play}
                gameId={gameid}
                color={color.didRedirect}
              />
            </div>
            <h4 style={{color: "snow"}}> você: {props.myUserName} </h4>
          </div>
        ) : gameSessionDoesNotExist ? (
          <div>
            <h1 style={{ textAlign: "center", marginTop: "200px" }}> :( </h1>
          </div>
        ) : (
          <div>
            <h1
              style={{
                color: "snow",
                textAlign: "center",
                marginTop: String(window.innerHeight / 8) + "px",
              }}
            >
              Hey <strong>{props.myUserName}</strong>, copia e cola a URL
               abaixo para enviar ao seu amigo:
            </h1>
            <textarea
              style={{ marginLeft: String((window.innerWidth / 2) - 290) + "px", marginTop: "30" + "px", width: "580px", height: "30px"}}
              onFocus={(event) => {
                  event.target.select()
              }}
              value = {domainName + "/game/" + gameid}
              type = "text">
              </textarea>
            <br></br>

            <h1 style={{color: "snow", textAlign: "center", marginTop: "100px" }}>
              {" "}
              Á espera do seu adversário para entrar no jogo...{" "}
            </h1>
          </div>
        )}
      </React.Fragment>
    );
};

export default ChessGameWrapper

