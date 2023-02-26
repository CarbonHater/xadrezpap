// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import JoinRoom from './onboard/joinroom'
import { ColorContext } from './context/colorcontext'
import Onboard from './onboard/onboard'
import JoinGame from './onboard/joingame'
import ChessGame from './chess/ui/chessgame'

/*
  * frontend flow:
  *
  * 1. O utilizador primeiro abre esta applicação no navegador.
  * 2. O utilizador escreve o seu nome de utilizador.
  * 2. aparece uma tela solicitando ao utilizador que envie ao amigo a URL do jogo para iniciar o jogo.
  * 3. o utilizador envia ao amigo o URL do jogo
  * 4. O amigo escreve o seu nome de utilizador.
  * 5. Assim que o amigo entrar, o jogo começa.
  */


function App() {

  const [didRedirect, setDidRedirect] = React.useState(false)

  const playerDidRedirect = React.useCallback(() => {
    setDidRedirect(true)
  }, [])

  const playerDidNotRedirect = React.useCallback(() => {
    setDidRedirect(false)
  }, [])

  const [userName, setUserName] = React.useState('')

  return (
    <ColorContext.Provider value = {{didRedirect: didRedirect, playerDidRedirect: playerDidRedirect, playerDidNotRedirect: playerDidNotRedirect}}>
      <Router>
        <Switch>
          <Route path = "/" exact>
            <Onboard setUserName = {setUserName}/>
          </Route>
          <Route path = "/game/:gameid" exact>
            {didRedirect ? 
              <React.Fragment>
                    <JoinGame userName = {userName} isCreator = {true} />
                    <ChessGame myUserName = {userName} />
              </React.Fragment> 
              :
              <JoinRoom />}
          </Route>
          <Redirect to = "/" />
        </Switch>
      </Router>
    </ColorContext.Provider>);
}

export default App;
