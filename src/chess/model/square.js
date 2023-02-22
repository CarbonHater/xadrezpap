/*
* square.js
*
* Este ficheiro contem uma classe para os quadrados do tabuleiro de xadrez em JavaScript.
*
* A classe possui um construtor que define as seguintes propriedades: x, y, canvascoord e pieceOnThisSquare.
* A classe também define O método: setPiece.
* O método setPiece que recebe um argumento newPiece permite atribuir uma peça a um quadrado.
*/

class Square {
    constructor(x, y, pieceOnThisSquare, canvasCoord) {
        // x é uma variável de tipo int que vai guardar a coordenada x: 0 < x < 7  do quadrado.
        this.x = x
        // y é uma variável de tipo int que vai guardar a coordenada y: 0 < y < 7  do quadrado.
        this.y = y 
        // canvasCoord é uma variável que vai guardar a coordenada no tabuleiro.
        this.canvasCoord = canvasCoord
        // pieceOnThisSquare é uma variável que que permite saber se uma peça esta sobre este quadrado.
        this.pieceOnThisSquare = pieceOnThisSquare
    }

    setPiece(newPiece) {
        /*
        * setPiece recebe um argumento newPiece.
        * Este método é usado para atribuir uma peça a um quadrado, remover uma peça de um quadrado ou substituir a peça num quadrado por uma peça diferente.
        * 
        * Dependendo dos valores de newPiece e da peça atual no quadrado, existem diferentes casos para o que a função faz.
        * Se newPiece não for nulo e houver peça no quadrado, e as peças forem de cores diferentes, a função substitui a peça no quadrado por newPiece e define a posição de newPiece como o quadrado atual.
        * Se as peças forem da mesma cor, a função retorna a string "user tried to capture their own piece".
        */

        // Se newPiece for nulo e não houver peça no quadrado, a função não faz nada.
        if (newPiece === null && this.pieceOnThisSquare === null) {
            return
        } else if (newPiece === null) {
            // (caso em que o chamador da função deseja remover a peça que está neste quadrado.) 
            // Se newPiece for nulo e houver peça no quadrado, a função remove a peça do quadrado e define sua posição como indefinida.
            this.pieceOnThisSquare.setSquare(undefined)
            this.pieceOnThisSquare = null
        } else if (this.pieceOnThisSquare === null) {
            // Se newPiece não for nulo e não houver peça no quadrado, a função atribui newPiece ao quadrado e define a posição de newPiece como o quadrado atual.
            this.pieceOnThisSquare = newPiece
            newPiece.setSquare(this)
        } else if (this.getPieceIdOnThisSquare() != newPiece.id && this.pieceOnThisSquare.color != newPiece.color) {
            // (Captura)
            // Caso em que o chamador da função deseja alterar a peça neste quadrado. (somente cores diferentes são permitidas).
            this.pieceOnThisSquare = newPiece
            newPiece.setSquare(this)
        } else {
            // Caso em que o jogador tento capturar a sua própria peça.
            return "user tried to capture their own piece"
        }
    }

    removePiece() {
        // Remover peça deste quadrado
        this.pieceOnThisSquare = null
    }

    getPiece() {
        // Obter a peça que esta neste quadrado
        return this.pieceOnThisSquare 
    }

    getPieceIdOnThisSquare() {
        // Obter o número de identificação da peça que esta neste quadrado
        // Retorne "empty" se não estiver nenhuma peça no quadrado
        if (this.pieceOnThisSquare === null) {
            return "empty"
        }

        return this.pieceOnThisSquare.id
    }

    isOccupied() {
        // Esta função verifica se o quadrado atual está ocupado por uma peça ou não.
        return this.pieceOnThisSquare != null
    }

    getCoord() {
        // Obtém as coordonadas da peça  
        return [this.x, this.y]
    }

    getCanvasCoord() {
        // Obtém as coordonadas no tabuleiro  
        return this.canvasCoord
    }
}

// export para poder utilizar a classe "Square" nos outros ficheiros
export default Square