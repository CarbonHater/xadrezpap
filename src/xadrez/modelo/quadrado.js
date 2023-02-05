class Square {
    constructor(x, y, pieceOnThisSquare, canvasCoord) {
        // Int 0 < y < 7 
        this.x = x
        // Int 0 < y < 7 
        this.y = y 
        // Coordenadas no tabuleiro
        this.canvasCoord = canvasCoord
        // ChessPiece || null
        this.pieceOnThisSquare = pieceOnThisSquare
    }

    setPiece(newPiece) {
        /*
        * A classe também possui um método chamado setPiece que recebe um argumento newPiece.
        * Este método é usado para atribuir uma peça a um quadrado, remover uma peça de um quadrado ou substituir a peça num quadrado por uma peça diferente.
        * Existem diferentes casos para o que a função faz, dependendo dos valores de newPiece e da peça atual no quadrado.
        * Se newPiece não for nulo e houver peça no quadrado, e as peças forem de cores diferentes, a função substitui a peça no quadrado por newPiece e define a posição de newPiece como o quadrado atual. Se as peças forem da mesma cor, a função retorna a string "user tried to capture their own piece".
        */

        // Se newPiece for nulo e não houver peça no quadrado, a função não faz nada.
        if (newPiece === null && this.pieceOnThisSquare === null) {
            return
        } else if (newPiece === null) {
            // Se newPiece for nulo e houver peça no quadrado, a função remove a peça do quadrado e define sua posição como indefinida.
            // (caso em que o chamador da função deseja remover a peça que está neste quadrado.)
            this.pieceOnThisSquare.setSquare(undefined)
            this.pieceOnThisSquare = null
        } else if (this.pieceOnThisSquare === null) {
            // Se newPiece não for nulo e não houver peça no quadrado, a função atribui newPiece ao quadrado e define a posição de newPiece como o quadrado atual.
            this.pieceOnThisSquare = newPiece
            newPiece.setSquare(this)
        } else if (this.getPieceIdOnThisSquare() != newPiece.id && this.pieceOnThisSquare.color != newPiece.color) {
            // caso em que o chamador da função deseja alterar a peça neste quadrado. (somente cores diferentes são permitidas).
            console.log("capture!")
            this.pieceOnThisSquare = newPiece
            newPiece.setSquare(this)
        } else {
            // caso em que o jogador tento capturar a sua própria peça.
            return "user tried to capture their own piece"
        }
    }

    removePiece() {
        // remover peça deste quadrado
        this.pieceOnThisSquare = null
    }

    getPiece() {
        // Obter a peça que esta neste quadrado
        return this.pieceOnThisSquare 
    }

    getPieceIdOnThisSquare() {
        // Obter o numero de identificação da peça que esta neste quadrado
        if (this.pieceOnThisSquare === null) {
            return "empty"
        }
        return this.pieceOnThisSquare.id
    }

    isOccupied() {
        // Essa função verifica se o quadrado atual está ocupado por uma peça ou não.
        return this.pieceOnThisSquare != null
    }

    getCoord() {
        // Obtem as coordonadas da peça  
        return [this.x, this.y]
    }

    getCanvasCoord() {
        // Obtem as coordonadas no tabuleiro  
        return this.canvasCoord
    }
}

// export para poder utilizar a class nos outros ficheiros
export default Square
