/* 
* Classe Jogo
*
* Esta é uma classe JavaScript que modela um jogo de xadrez.
* Ele tem dois atributos principais: thisPlayersColorIsWhite e chessBoard.
* O primeiro é uma flag boolean que indica se o jogador a jogar é branco ou preto.
* O segundo é a representação atual do tabuleiro de xadrez.
*
* O construtor da classe Game inicializa esses atributos e também cria um objeto chess usando a biblioteca chess.js.
* Além disso, ele cria vários mapeamentos para ajudar a traduzir coordenadas entre as representações
* do tabuleiro do jogo e as representações de movimentos de peças no objeto chess.
*
* A classe tem vários métodos incluindo getBoard, que retorna o estado atual do tabuleiro, e movePiece, que move uma peça no tabuleiro.
* Este método usa o objeto chess para verificar se o movimento é válido antes de atualizar o estado do tabuleiro.
*/

// importa os outros ficheiros e a biblioteca chess.js
import Chess from 'chess.js'
import ChessPiece from './chesspiece'
import Square from './square'

// Quando indexar, lembra-se: [y][x]. 
// Se a cor do jogador for preta, inverter o tabuleiro.

class Game {
    // constructor para definir a posição das peças e do tabuleiro em função do jogador (branco ou preto). O tabuleiro esta invertido para o outro jogador.
    constructor(thisPlayersColorIsWhite) {
        // uma vez inicializado, esse valor nunca deve mudar.
        this.thisPlayersColorIsWhite = thisPlayersColorIsWhite 
        // makeStartingBoard é un methodo da biblioteca chess.js que permite criar um tabuleiro
        this.chessBoard = this.makeStartingBoard()
        // define a posição das peças, tabuleiro inicia com a posição inicial predefinida quando chamado sem parâmetros
        this.chess = new Chess()


        /* define as coordonadas de cada peça.
        * se o jogador e branco, as peças brancas e pretas não têm as mesmas coordenadas do que o jogador preto.
        *
        * toCoord = coordonadas numerais das peças brancas
        * toAlphabet = coordonadas alphabeticas das peças brancas
        * toCoord2 = coordonadas numerais das peças pretas
        * toAlphabet2 = coordonadas alphabeticas das peças pretas
        * cada peça tem como coordenadas um numero e uma letra. exemplo: a1
        *
        * mais sobre o ternary operator "?" -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
        */
        this.toCoord = thisPlayersColorIsWhite ? {
            0:8, 1:7, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1
        } : {
            0:1, 1:2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8
        }
        
        this.toAlphabet = thisPlayersColorIsWhite ? {
            0:"a", 1:"b", 2: "c", 3: "d", 4: "e", 5: "f", 6: "g", 7: "h"
        } : {
            0:"h", 1:"g", 2: "f", 3: "e", 4: "d", 5: "c", 6: "b", 7: "a"
        }

        this.toCoord2 = thisPlayersColorIsWhite ? {
            8:0, 7:1, 6: 2, 5: 3, 4: 4, 3: 5, 2: 6, 1: 7
        } : {
            1:0, 2:1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7
        }
        
        this.toAlphabet2 = thisPlayersColorIsWhite ? {
            "a":0, "b":1, "c":2, "d":3, "e":4, "f":5, "g":6, "h":7
        } : {
            "h":0, "g":1, "f":2, "e":3, "d":4, "c":5, "b":6, "a":7
        }

        // quantas reinhas um dado jogador tem. Num jodo de xadrez, é possivel obter uma reinha se um pião chegar do outro lado do tabulheiro. 
        this.nQueens = 1
    }

    setBoard(newBoard) {
        // Criar um novo tabuleiro.
        this.chessBoard = newBoard
    }

    getBoard() {
        // Obter a estrutura atual do tabuleiro.
        return this.chessBoard
    }

    movePiece(pieceId, to, isMyMove) {
        /*
        * O método movePiece é usado para mover uma peça de xadrez no tabuleiro.
        *
        * Em primeiro lugar, o método mapeia a posição no tabuleiro para coordenadas bidimensionais (to2D),
        * dependendo de se o movimento é feito pelo jogador atual (isMyMove).
        *  
        * em segundo lugar, recupera o tabuleiro atual e encontra a posição atual da peça (peçaCoordenadas) com "this.findPiece".
        * Se a peça não for encontrada no tabuleiro, o método retorna imediatamente.
        * Se a peça for encontrada, calcula a nova posição (to_y, to_x) com base em to2D e no parâmetro "to".
        * 
        * Depois, usa a biblioteca de xadrez para verificar se o movimento é válido.
        * Se o movimento não for válido, o método retorna "invalid move" (movimento inválido).
        * Se o movimento for válido, ele verifica se é uma promoção de peão com "this.isPawnPromotion".
        * Se a promoção for válida, o método promove o peão a rainha, caso contrário, faz a jogada.
        * 
        * Finalemente, ele verifica se o movimento resultou em um roque com "this.isCastle".
        * Nesse caso, ele move a torre para sua nova posição.
        * O método atualiza o modelo do tabuleiro, defina a nova posição da peça e remove a posição original da peça.
        * Se um jogador tenta mexer para a sua própria posição, o método retornará "moved in the same position." (utilizador tentou mexer na mesma posição).
        * Se um jogador tenta capturar sua própria peça, o método retornará "user tried to capture their own piece" (utilizador tentou capturar sua própria peça). 
        * O método também mostra a vez do jogador atual e se o jogador está em xeque-mate.
        */
      
        const to2D = this.getTo2D(isMyMove);
        var currentBoard = this.getBoard()
        const pieceCoordinates = this.findPiece(currentBoard, pieceId)
        
        
        // não se consegue encontrar as coordenadas da peça (a peça não existe no tabuleiro)
        if (!pieceCoordinates) {
            return
        }

        const y = pieceCoordinates[1]
        const x = pieceCoordinates[0]

        // novas coordenadas
        const to_y = to2D[to[1]]
        const to_x = to2D[to[0]]

        const originalPiece = currentBoard[y][x].getPiece()
    
        if (y === to_y && x === to_x) {
            return "moved in the same position."
        }

        // Para que este método faça algo significativo,
        // a linha de código 'reassign const' deve ser executada. Portanto,
        // para que funcione, devemos primeiro verificar se o movimento dado é válido.
        
        
        const isPromotion = this.isPawnPromotion(to, pieceId[1])
        const moveAttempt = this.makeMove(x, y, to2D, to, pieceId, isPromotion);

        if (moveAttempt === null) {
            return "invalid move"
        }

        this.handleMoveAttempt(moveAttempt, currentBoard);

        // Verificar roque
        const castle = this.isCastle(moveAttempt)

        if (castle.didCastle) {
            /*
            * A principal coisa que estamos a fazer aqui é mover a torre certa
            * para a posição certa.
            *
            * - obter a peça original chamando getPiece() no original [x, y]
            * - Defina o novo [to_x, to_y] para a peça original
            * - Defina o original [x, y] como nulo
            */
            const originalRook = currentBoard[castle.y][castle.x].getPiece()
            currentBoard[castle.to_y][castle.to_x].setPiece(originalRook)
            currentBoard[castle.y][castle.x].setPiece(null)
        }


        // ___ mudar o modelo do tabuleiro __

        const reassign = isPromotion ? currentBoard[to_y][to_x].setPiece(
            new ChessPiece(
                'queen', 
                false, 
                pieceId[0] === 'w' ? 'white' : 'black', 
                pieceId[0] === 'w' ? 'wq' + this.nQueens : 'bq' + this.nQueens))
            : currentBoard[to_y][to_x].setPiece(originalPiece)

        if (reassign !== "user tried to capture their own piece") {
            currentBoard[y][x].setPiece(null)
        } else {
            return reassign
        }

        // ___ mudar o modelo do tabuleiro __


        const checkMate = this.chess.in_checkmate() ? " has been checkmated" : " has not been checkmated"
        console.log(this.chess.turn() + checkMate)
        if (checkMate === " has been checkmated") {
            return this.chess.turn() + checkMate
        }

        // "altera a cor de preenchimento do rei do adversário que está em xeque"
        const check = this.chess.in_check() ? " is in check" : " is not in check"
        console.log(this.chess.turn() + check)
        if (check === " is in check") {
            return this.chess.turn() + check
        }

        // atualizar tabuleiro
        this.setBoard(currentBoard)
    }

    getTo2D(isMyMove) {
        /* 
        * Este método recebe um argumento booleano isMyMove e retorna um objeto literal.
        * Dependendo do valor de isMyMove, ele retorna um dos dois objetos a seguir
        * 
        * o primeiro int é a posição (em pixeis) da linha no tabuleiro o segundo int é o numero da linha correspondente
        */
        return isMyMove ? {
            105:0, 195:1, 285: 2, 375: 3, 465: 4, 555: 5, 645: 6, 735: 7
        } : {
            105:7, 195:6, 285: 5, 375: 4, 465: 3, 555: 2, 645: 1, 735: 0
        };
    }

    makeMove(x, y, to2D, to, pieceId, isPromotion) {
        /*
        * x e y: as coordenadas x e y da peça que o jogador deseja mover
        * to2D: um objeto que representa o mapeamento da coordenada x para uma coluna em um tabuleiro de xadrez
        * para: uma matriz contendo as coordenadas x e y do quadrado de destino no tabuleiro de xadrez
        * pieceId: uma string que representa o tipo de peça (por exemplo, 'P' para peão)
        * isPromotion: um valor booleano que indica se a jogada é ou não uma promoção de peão 
        * 
        * A função usa o método chess.move de a biblioteca chess.js para fazer uma jogada no tabuleiro de xadrez.
        * O movimento é construído a partir dos parâmetros de entrada usando as propriedades "from", "to" e "piece".
        * 
        * Se "isPromotion" for verdadeiro, o movimento é modificado adicionando uma propriedade de promoção com o valor 'q' (promovendo o peão a uma rainha).
        * Finalmente, o método chess.move é chamado para fazer a jogada e o resultado é retornado.
        */

        return !isPromotion ? this.chess.move({
            from: this.toChessMove([x, y], to2D),
            to: this.toChessMove(to, to2D),
            piece: pieceId[1]})
        : 
        this.chess.move({
            from: this.toChessMove([x, y], to2D),
            to: this.toChessMove(to, to2D),
            piece: pieceId[1],
            promotion: 'q'
        });
    }

    handleMoveAttempt (moveAttempt, currentBoard) {
        /*
        * Este método é usado para lidar com uma tentativa de movimento.
        * O parámetro "moveAttempt" é um objeto que representa o movimento que está a ser tentado. 
        * "currentBoard" é um array bidimensional que representa o estado atual do tabuleiro de xadrez.
        * 
        * O método verifica se o movimento tem um sinalizador 'e'.
        * Se o sinalizador for 'e', ele executa as seguintes etapas:
        * 
        * Extrai o quadrado alvo do movimento com "moveAttempt.to".
        * 
        * Converte a coluna do quadrado de destino de uma letra para um número com "this.toAlphabet2".
        * 
        * Calcula a linha do quadrado de destino com base no fato de o movimento ser feito pelo jogador branco ou preto.
        * Para o jogador branco, a classificação é calculada como parseInt(move[1], 10) - 1.
        * Para o jogador preto, é calculada como parseInt(move[1], 10) + 1.
        * 
        * Limpa a peça do quadrado de destino chamando o método setPiece do elemento correspondente em "currentBoard" com um argumento nulo.
        * A linha e a coluna são encontradas com "this.toCoord2", que mapeia números para strings.
        */
        
        if (moveAttempt.flags === 'e') {
            const move = moveAttempt.to 
            const x = this.toAlphabet2[move[0]]
            let y
            if (moveAttempt.color === 'w') {
                y = parseInt(move[1], 10) - 1
            } else {
                y = parseInt(move[1], 10) + 1 
            }
            currentBoard[this.toCoord2[y]][x].setPiece(null)
        }
    }

    isCastle(moveAttempt) {
        // Verifica se um movimento feito por um jogador é um movimento de roque.

        const piece = moveAttempt.piece
        const move = {from: moveAttempt.from, to: moveAttempt.to}

        const isBlackCastle = ((move.from === 'e1' && move.to === 'g1') || (move.from === 'e1' && move.to === 'c1')) 
        const isWhiteCastle = (move.from === 'e8' && move.to === 'g8') || (move.from === 'e8' && move.to === 'c8')
        

        if (!(isWhiteCastle || isBlackCastle) || piece !== 'k') {
            return {
                didCastle: false
            }
        }

        let originalPositionOfRook
        let newPositionOfRook

        if ((move.from === 'e1' && move.to === 'g1')) {
            originalPositionOfRook = 'h1'
            newPositionOfRook = 'f1'
        } else if ((move.from === 'e1' && move.to === 'c1')) {
            originalPositionOfRook = 'a1'
            newPositionOfRook = 'd1'
        } else if ((move.from === 'e8' && move.to === 'g8')) {
            originalPositionOfRook = 'h8'
            newPositionOfRook = 'f8'
        } else { // e8 to c8
            originalPositionOfRook = 'a8'
            newPositionOfRook = 'd8'
        }   

    
        return {
            didCastle: true, 
            x: this.toAlphabet2[originalPositionOfRook[0]], 
            y: this.toCoord2[originalPositionOfRook[1]], 
            to_x: this.toAlphabet2[newPositionOfRook[0]], 
            to_y: this.toCoord2[newPositionOfRook[1]]
        }
    }


    isPawnPromotion(to, piece) {
        // Verifica se um movimento feito por um jogador é uma promoção de pião.

        const isPromoted = piece === 'p' && (to[1] === 105 || to[1] === 735)
        if (isPromoted) {
            this.nQueens += 1
        }
        return isPromoted
    }


    toChessMove(finalPosition, to2D) {
      
        let move 

        if (finalPosition[0] > 100) {
            move = this.toAlphabet[to2D[finalPosition[0]]] + this.toCoord[to2D[finalPosition[1]]]
        } else {
            move = this.toAlphabet[finalPosition[0]] + this.toCoord[finalPosition[1]]
        }
        return move
    }

    findPiece(board, pieceId) {
        // Obter o numero de identificação da peça jogada

        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (board[i][j].getPieceIdOnThisSquare() === pieceId) {
                    return [j, i]
                }
            }
        }
    }

    makeStartingBoard() {
        /*
        * Este método cria o tabuleiro inicial para o jogo de xadrez.
        * Cria um array 2D 8x8 chamado "startingChessBoard" e o preenche com quadrados vazios representados por instâncias da classe "Square".
        * As fileiras de trás para as peças pretas e brancas são então adicionadas às linhas superior e inferior do tabuleiro, respectivamente.
        * O tipo e a cor da peça são determinados pelo array "backRank" e pela propriedade "thisPlayersColorIsWhite".
        * 
        * O método retorna o "startingChessBoard".
        */
        const backRank = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
        var startingChessBoard = []
        for (var i = 0; i < 8; i++) {
            startingChessBoard.push([])
            for (var j = 0; j < 8; j++) {
                // j é horizontal
                // i é vertical
                const coordinatesOnCanvas = [((j + 1) * 90 + 15), ((i + 1) * 90 + 15)]
                const emptySquare = new Square(j, i, null, coordinatesOnCanvas)
                
                startingChessBoard[i].push(emptySquare)
            }
        }
        const whiteBackRankId = ["wr1", "wn1", "wb1", "wq1", "wk1", "wb2", "wn2", "wr2"]
        const blackBackRankId = ["br1", "bn1", "bb1", "bq1", "bk1", "bb2", "bn2", "br2"]
        for (var j = 0; j < 8; j += 7) {
            for (var i = 0; i < 8; i++) {
                if (j == 0) {
                    // top
                    startingChessBoard[j][this.thisPlayersColorIsWhite ? i : 7 - i].setPiece(new ChessPiece(backRank[i], false, this.thisPlayersColorIsWhite ? "black" : "white", this.thisPlayersColorIsWhite ? blackBackRankId[i] : whiteBackRankId[i]))
                    startingChessBoard[j + 1][this.thisPlayersColorIsWhite ? i : 7 - i].setPiece(new ChessPiece("pawn", false, this.thisPlayersColorIsWhite ? "black" : "white", this.thisPlayersColorIsWhite ? "bp" + i : "wp" + i))
                } else {
                    // bottom
                    startingChessBoard[j - 1][this.thisPlayersColorIsWhite ? i : 7 - i].setPiece(new ChessPiece("pawn", false, this.thisPlayersColorIsWhite ? "white" : "black", this.thisPlayersColorIsWhite ? "wp" + i : "bp" + i))
                    startingChessBoard[j][this.thisPlayersColorIsWhite ? i : 7 - i].setPiece(new ChessPiece(backRank[i], false, this.thisPlayersColorIsWhite ? "white" : "black", this.thisPlayersColorIsWhite ? whiteBackRankId[i] : blackBackRankId[i]))
                }
            }
        }
        return startingChessBoard
    }
}

export default Game