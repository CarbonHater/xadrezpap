/*
* chesspiece.js
*
* Este ficheiro contem uma classe para as peças de xadrez em JavaScript.
* 
* A classe possui um construtor que recebe como entrada as seguintes propriedades: name, isAttacked, color e id.
* A classe também define dois métodos: setSquare e getSquare.
*
* O método setSquare permite definir o quadrado em que a peça está usando o método setPiece do quadrado.
* O método getSquare retorna o quadrado em que a peça está.
*/

class ChessPiece {
    constructor(name, isAttacked, color, id) {
        // name é uma variável de tipo string que vai guardar o nome da peça.
        this.name = name
        // isAttacked é uma variável Boolean para saber se a peça esta a ser atacada (1 = atacado, 0 = não atacado).
        this.isAttacked = isAttacked 
        // color é uma variável de tipo string que vai guardar a cor da peça.
        this.color = color
        // id é uma variável de tipo string que vai guardar o numero de identificação da peça 
        this.id = id
    }

    setSquare(newSquare) {
        /*
        * O método setSquare leva um argumento newSquare que representa o novo quadrado no qual a peça será colocada.
        *
        * Se newSquare for indefinido, o método retornará imediatamente sem fazer alterações.
        * 
        */

        // Se newSquare for indefinido, define a propriedade squareThisPieceIsOn do objeto como newSquare. 
        if (newSquare === undefined) {
            this.squareThisPieceIsOn = newSquare
            return 
        }

        // Se squareThisPieceIsOn for indefinido ou diferente de newSquare, ele definirá a propriedade
        // squareThisPieceIsOn como newSquare e chamará o método setPiece em newSquare com "this" como argumento.
        if (this.squareThisPieceIsOn === undefined) {
            this.squareThisPieceIsOn = newSquare
            newSquare.setPiece(this)
        }

        const isNewSquareDifferent = this.squareThisPieceIsOn.x !== newSquare.x || this.squareThisPieceIsOn.y !== newSquare.y

        if (isNewSquareDifferent) {
            this.squareThisPieceIsOn = newSquare
            newSquare.setPiece(this)
        }
    }

    getSquare() {
        // obter o quadrado no qual a peça esta atualmente
        return this.squareThisPieceIsOn
    }
}

// export para poder utilizar a classe ChessPiece nos outros ficheiros
export default ChessPiece