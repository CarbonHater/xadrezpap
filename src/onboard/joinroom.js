/*
* joinroom.js
*
* joinroom é onde realmente entramos na sala de jogo
*/

// imports
import React from 'react'
import JoinGame from './joingame'
import ChessGame from '../chess/ui/chessgame'

class JoinRoom extends React.Component {
    state = {
        didGetUserName: false,
        inputText: ""
    }

    constructor(props) {
        super(props);
        this.textArea = React.createRef();
    }

    typingUserName = () => {
        // pegue o texto de entrada do campo do DOM
        const typedText = this.textArea.current.value
        
        // definir o estado com esse texto
        this.setState({
            inputText: typedText
        })
    }

    render() {
    
        return (<React.Fragment>
            {
                this.state.didGetUserName ? 
                <React.Fragment>
                    <JoinGame userName = {this.state.inputText} isCreator = {false}/>
                    <ChessGame myUserName = {this.state.inputText}/>
                </React.Fragment>
            :
               <div>
                    <h1 style={{textAlign: "center", marginTop: String((window.innerHeight / 3)) + "px"}}>Nome de utilizador:</h1>

                    <input style={{marginLeft: String((window.innerWidth / 2) - 120) + "px", width: "240px", marginTop: "62px"}} 
                           ref = {this.textArea}
                           onInput = {this.typingUserName}></input>
                           
                    <button className="btn btn-primary" 
                        style = {{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px", marginTop: "62px"}} 
                        disabled = {!(this.state.inputText.length > 0)} 
                        onClick = {() => {
                            /* 
                            * Quando o botão 'Começar' é pressionado na tela de nome de utilizador,
                            * Devemos enviar uma solicitação ao servidor para criar uma nova sala com
                            * o uuid que geramos aqui.
                            */ 
                            this.setState({
                                didGetUserName: true
                            })
                        }}>Começar</button>
                </div>
            }
            </React.Fragment>)
    }
}

export default JoinRoom