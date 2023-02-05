
// import necessários para este ficheiro
import React from 'react'
import { Image } from 'react-konva';
import useImage from 'use-image'

const Piece = (props) => {
    /* isto é um componente React que exibe uma peça de xadrez no tabuleiro. O componente recebe várias propriedades como "props":
    *
    * "props.isWhite" determina a cor da peça (branco ou preto).
    * "props.imgurls" é um array que contém as URLs das imagens das peças brancas e pretas.
    * "props.id" é o identificador único da peça.
    * "props.draggedPieceTargetId" é o id da peça que está a ser arrastada no momento.
    * "props.thisPlayersColorIsWhite" indica a cor das peças que o jogador está a utilisar.
    * "props.playerTurnToMoveIsWhite" indica a cor das peças que podem fazer um movimento.
    * "props.whiteKingInCheck" e "props.blackKingInCheck" indicam se os reis branco e preto estão em xeque, respectivamente.
    * 
    * Usa a biblioteca "useImage" para importar uma imagem com base na propriedade "choiceOfColor".
    * Usa o componente "Image" da biblioteca "react-konva" para exibir a peça de xadrez no tabuleiro.
    * A peça é arrastável se for a vez do jogador que está a usar peças dessa cor e se a peça que está a ser exibida for da mesma cor das peças do jogador.
    * 
    * Também altera a largura e a altura da peça se ela estiver arrastada.
    * Define a propriedade "fill" como vermelha se o rei da mesma cor estiver em xeque.
    * Define a propriedade "id" para o identificador exclusivo da peça.
    */ 
   
    const choiceOfColor = props.isWhite ? 0 : 1
    const [image] = useImage(props.imgurls[choiceOfColor]);
    const isDragged = props.id === props.draggedPieceTargetId

    const canThisPieceEvenBeMovedByThisPlayer = props.isWhite === props.thisPlayersColorIsWhite
    const isItThatPlayersTurn = props.playerTurnToMoveIsWhite === props.thisPlayersColorIsWhite

    const thisWhiteKingInCheck = props.id === "wk1" && props.whiteKingInCheck
    const thisBlackKingInCheck = props.id === "bk1" && props.blackKingInCheck

    return <Image image={image}
         x = {props.x - 90}
         y = {props.y - 90}
         draggable = {canThisPieceEvenBeMovedByThisPlayer && isItThatPlayersTurn}
         width = {isDragged ? 75 : 60}
         height = {isDragged ? 75 : 60}
         onDragStart = {props.onDragStart}
         onDragEnd = {props.onDragEnd}
         fill = {(thisWhiteKingInCheck && "red") || (thisBlackKingInCheck && "red")}
         id = {props.id}
         />;
};

// export para poder utilisar nos outros ficheiros
export default Piece