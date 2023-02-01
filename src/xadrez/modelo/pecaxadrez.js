/*
Este código é uma classe para uma peça de xadrez em JavaScript.
A classe possui um construtor que recebe como entrada as seguintes propriedades: nome, está sendo atacado, cor e id.
A classe também define dois métodos: setSquare e getSquare.
O método setSquare permite definir o quadrado em que a peça está, usando o método setPiece do quadrado.
O método getSquare retorna o quadrado em que a peça está.
*/

class ChessPiece {

    constructor(name, isAttacked, color, id) {
        /* 
        Construtor que recebe como entrada as seguintes propriedades: nome, está sendo atacado, cor e id.
        */

        // name é uma variavel de tipo string que vai guardar o nome da peça.
        this.name = name
        // isAttacked = valor Boolean para saber se a peça esta a ser atacada (1 = atacado, 0 = não atacado).
        this.isAttacked = isAttacked 
        // color é uma variavel de tipo string que vai guardar a cor da peça.
        this.color = color
        // id é uma variavel de tipo string que vai guardar o numero de identificação da peça 
        this.id = id
    }

    setSquare(newSquare) {

        // O método setSquare leva um argumento newSquare, que representa o novo quadrado no qual a peça será colocada.
        // O método define a propriedade squareThisPieceIsOn do objeto como newSquare. 
        // Se newSquare for indefinido, o método retornará imediatamente sem fazer alterações.
        // Se squareThisPieceIsOn for indefinido ou diferente de newSquare, ele definirá a propriedade
        // squareThisPieceIsOn como newSquare e chamará o método setPiece em newSquare com "this" como argumento.

        if (newSquare === undefined) {
            // this refers to the class
            this.squareThisPieceIsOn = newSquare
            return 
        }

        if (this.squareThisPieceIsOn === undefined) {
            this.squareThisPieceIsOn = newSquare
            newSquare.setPiece(this)
        }

        const isNewSquareDifferent = this.squareThisPieceIsOn.x != newSquare.x || this.squareThisPieceIsOn.y != newSquare.y

        if (isNewSquareDifferent) {
            this.squareThisPieceIsOn = newSquare
            newSquare.setPiece(this)
        }
    }

    getSquare() {
        // obter o quadrado no qual a peça esta
        return this.squareThisPieceIsOn
    }
}

// export para poder utilizar a class nos outros ficheiros
export default ChessPiece