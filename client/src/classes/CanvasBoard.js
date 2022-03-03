import GameState from './GameState'
import CanvasSquares from './CanvasSquares'
import { move_logic } from '../logic/logic'

export default class CanvasBoard{
    constructor(size,fen,orientation,onDrop=null){
        this.size = size
        this.fen = fen
        this.orientation = orientation
        this.onDrop = onDrop;
        this.sqSz = this.size/8
        this.initialState = new GameState(fen).state
        this.whitePieces = ["P","R","N","B","Q","K"]
        this.blackPieces = ["p", "r", "n", "b", "q", "k"]
        
        this.promoting = false;
        this.pieceSelected = false;
        this.selectedPiece = null;
        
        this.init = function(){
            const ranks = [8,7,6,5,4,3,2,1]
            const revRanks = [...ranks].reverse()  
            const files = ["a","b","c","d","e","f","g","h"]
            const revFiles = [...files].reverse()
            let squares = [];
            let index = 0;
            
                for(let i=0; i<8; i++) {
                    for(let j=0; j<8; j++,index++) {   
                    const squareSize = this.size/8
                    const fillStyle = ((i+j)%2===0) ? "#f0d9b5":"#b58863";
                    const moveFillStyle = ((i+j)%2===0) ? "#ced26b":"#aba23a";
                    const color = ((i+j)%2===0) ? "white":"black";
                    let xOffset = 0 + i*squareSize;
                    let yOffset = 0 + j*squareSize;
                    
                        if (this.orientation === 'w') {
                            squares.push(new CanvasSquares(yOffset, squareSize+yOffset, xOffset, squareSize+xOffset,files[j]+ranks[i],color,fillStyle,moveFillStyle,index))
                        } else {
                            squares.push(new CanvasSquares(yOffset, squareSize+yOffset, xOffset, squareSize+xOffset,revFiles[j]+revRanks[i],color,fillStyle,moveFillStyle,index))
                            
                        }

                        if (this.fen.includes('w')) { this.turn = true } else{this.turn = false;}
                        
                    
                    }
                }
                
            this.setSqCtx = squares
            this.setCurrentState = this.initialState 
       
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
    
    get currentSqCtx() {
        return this.sqCtx
    }
    set setSqCtx(arr){
        this.sqCtx = arr
    }

    set setMove(obj){
        if(this.onDrop === null){
            return
        } else {
            
            this.onDrop(obj)
        }
    }
    set setPrevMove(obj){
        this.prevMove = obj
    }

    set setTurn(bool){
        this.turn = bool
    }

    // Methods //
    returnSquareByIndex(index){
        const square = this.sqCtx.filter(sq => sq.index === index)
        return square[0]
        
    }
    returnSquareByNotation(notation){
        const square = this.sqCtx.filter(sq => sq.notation === notation)
        return square[0]
    }

    returnSquareByCtx(x,y){
        const square = this.sqCtx.filter(sq => sq.minX <= x && sq.maxX >= x && sq.minY <= y && sq.maxY >= y)
        return square[0]
        
    }
    // Game State Methods //
    pieceBool(index,arr) {
        if(arr[index] === ""){return false
        }else{return true}
    }

    squarePieceChar(index,arr){
        return arr[index]
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
    // Canvas Methods //
    getPromotionSquares(char,move){
        const file = move.to.file
        let promotionSquares = []
        let qSq
        let nSq
        let rSq
        let bSq
        if(char === 'p'){
            qSq = this.returnSquareByNotation(file+1)
            nSq = this.returnSquareByNotation(file+2)
            rSq = this.returnSquareByNotation(file+3)
            bSq = this.returnSquareByNotation(file+4)
            qSq.pieceChar = 'q'
            nSq.pieceChar = 'n'
            rSq.pieceChar = 'r'
            bSq.pieceChar = 'b'
        } else{
            qSq = this.returnSquareByNotation(file+8)
            nSq = this.returnSquareByNotation(file+7)
            rSq = this.returnSquareByNotation(file+6)
            bSq = this.returnSquareByNotation(file+5)
            qSq.pieceChar = 'Q'
            nSq.pieceChar = 'N'
            rSq.pieceChar = 'R'
            bSq.pieceChar = 'B'
        }
        promotionSquares.push(qSq,nSq,rSq,bSq)
        return promotionSquares
    }
    drawPieces(ctx, char, index) {
        if(char !== ""){
          function drawImageActualSize(){ctx.drawImage(this, this.centerX, this.centerY, this.width, this.height)}
            const sq = this.returnSquareByIndex(index)
            const sqSize = sq.maxX - sq.minX
            const img = new Image(sqSize, sqSize); 
            img.src = `/img/${char}.svg`
            img.centerX = sq.minX
            img.centerY = sq.minY
            img.onload = drawImageActualSize;
            
        }
    }
    makeMove(move){
        setTimeout(() => {
            let moveObj
            const from = this.board.returnSquareByNotation(move.slice(0,2))
            const to = this.board.returnSquareByNotation(move.slice(2,4))
            const promotedPiece = move.charAt(4)
            
            if(promotedPiece === ""){
                moveObj = {"from":from,"to":to}
            } else{
                moveObj = {"from":from,"to":to,"promotion":promotedPiece}
            }
            
            move_logic(this.board,this.canvas,this.ctx,moveObj)
        }, 800);
        
    }
}
