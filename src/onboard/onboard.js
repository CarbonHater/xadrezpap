/*
* onboard.js
*
* Onboard é onde criamos a sala de jogo.
*/

// imports
import React from 'react'
import { Redirect } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { ColorContext } from '../context/colorcontext' 
const socket  = require('../connection/socket').socket


class CreateNewGame extends React.Component {
    state = {
        didGetUserName: false,
        inputText: "",
        gameId: ""
    }

    constructor(props) {
        super(props);
        this.textArea = React.createRef();
    }
    
    send = () => {
        /*
        * Este método deve criar uma nova sala no namespace '/'
        * com um identificador único.
        */
        const newGameRoomId = uuidv4()
        
        /*
        * define o estado deste componente com o gameId para que seja possivel
        * redirecionar o utilizador para esse URL posteriormente.
        */
        this.setState({
            gameId: newGameRoomId
        })

        // emite um evento para o servidor para criar uma nova sala
        socket.emit('createNewGame', newGameRoomId)
    }

    typingUserName = () => {
        // pega o texto de entrada do campo do DOM
        const typedText = this.textArea.current.value
        
        // define o estado com esse texto
        this.setState({
            inputText: typedText
        })
    }

    render() {
        // !!! TODO: edite isso mais tarde depois de comprar seu próprio domínio.
        return (<React.Fragment>
            {
                this.state.didGetUserName ? 

                <Redirect to = {"/game/" + this.state.gameId}><button className="btn btn-success" style = {{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px"}}>Começar o jogo</button></Redirect>

            :
               <div>
                    <h1 style={{textAlign: "center", marginTop: String((window.innerHeight / 3)) + "px"}}>Nome de Utilizador:</h1>

                    <input style={{marginLeft: String((window.innerWidth / 2) - 120) + "px", width: "240px", marginTop: "62px"}} 
                           ref = {this.textArea}
                           onInput = {this.typingUserName}></input>
                           
                    <button className="btn btn-primary" 
                        style = {{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px", marginTop: "62px"}} 
                        disabled = {!(this.state.inputText.length > 0)} 
                        onClick = {() => {
                            /*
                            * Quando o botão 'Enviar' for pressionado na tela de nome de utilizador,
                            * Devemos enviar uma solicitação ao servidor para criar uma nova sala com
                            * o uuid que geramos aqui.
                            */
                            this.props.didRedirect() 
                            this.props.setUserName(this.state.inputText) 
                            this.setState({
                                didGetUserName: true
                            })
                            this.send()
                        }}>Começar</button>
                </div>
            }
            </React.Fragment>)
    }
}

const Onboard = (props) => {
    const color = React.useContext(ColorContext)

    return <CreateNewGame didRedirect = {color.playerDidRedirect} setUserName = {props.setUserName}/>
}


export default Onboard