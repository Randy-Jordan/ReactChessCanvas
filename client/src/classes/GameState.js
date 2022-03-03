import { iterateString,fenString,removeSlash } from '../utilities/utils.js'

export default class GameState{
    constructor(fen='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
        this.fen = fen
        this.init = function () {
            this.setCurrentState = this.createBoardArray(this.fen)
        }
        this.init()
    }

    // Getters and Setters //
    get currentState() {
        return this.state
    }
    
    set setCurrentState(arr) {
        this.state = arr
    }

    // Methods //
    createBoardArray(fen) {
        const string = fenString(fen)
        const newString = removeSlash(string)
        const boardArray = iterateString(newString)
        return boardArray
    }

    pieceBool(index,arr) {
        if (arr[index] === "") { return false }
        else { return true }
    }
    swapPieces(indexFrom,indexTo,arr){
        arr[indexTo] = arr[indexFrom]
        arr[indexFrom] = ''
        return arr
    }
    promotePiece(piece,indexTo,arr){
        arr[indexTo] = piece
        return arr
    }
    squarePieceChar(index,arr){
        return arr[index]
    }
}