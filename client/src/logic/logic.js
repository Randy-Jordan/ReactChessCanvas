import {mouse_click_handler,mouse_move_handler} from '../handlers/handlers'
import {diffArr} from '../utilities/utils'

export function move_logic(board,canvas,ctx,move){
    const fromChar = board.squarePieceChar(move.from.index,board.state)
    const toChar = board.squarePieceChar(move.to.index,board.state)
    const bool = board.turn     
    board.setTurn = !bool
    
    // soundAnimation(toChar)

    if((fromChar === "P" && parseInt(move.to.rank) === 8) || (fromChar === "p" && parseInt(move.to.rank) === 1)){
        promotion_animation(board,canvas,ctx,move)
           
        
    }else{
        updateCanvasState(board,ctx,move)
        updateBoardState(board,move)
        
        
    }
}

export function updateCanvasState(board,ctx,move){
    
    const sqSize = board.size/8
    const prevMove = board.prevMove
    
    if(prevMove !== undefined){    
        const char = board.squarePieceChar(move.from.index,board.state)
        const prevChar = board.squarePieceChar(prevMove.to.index,board.state)
        

        ctx.clearRect(prevMove.from.minX, prevMove.from.minY, sqSize, sqSize);
        ctx.clearRect(prevMove.to.minX, prevMove.to.minY, sqSize, sqSize);

        ctx.fillStyle = prevMove.from.fillStyle
        ctx.fillRect(prevMove.from.minX, prevMove.from.minY, sqSize, sqSize)

        ctx.fillStyle = prevMove.to.fillStyle
        ctx.fillRect(prevMove.to.minX, prevMove.to.minY, sqSize, sqSize)

        const prevImg = new Image(sqSize, sqSize); 
        prevImg.src = `/img/${prevChar}.svg`
        ctx.drawImage(prevImg, prevMove.to.minX,prevMove.to.minY, sqSize, sqSize);

        ctx.clearRect(move.from.minX, move.from.minY, sqSize, sqSize);
        ctx.clearRect(move.to.minX, move.to.minY, sqSize, sqSize);

        ctx.fillStyle = move.from.moveFillStyle
        ctx.fillRect(move.from.minX, move.from.minY, sqSize, sqSize)

        ctx.fillStyle = move.to.moveFillStyle
        ctx.fillRect(move.to.minX, move.to.minY, sqSize, sqSize)

        const img = new Image(sqSize, sqSize); 
        img.src = `/img/${char}.svg`
        ctx.drawImage(img, move.to.minX,move.to.minY, sqSize, sqSize);        
    }else{
        const char = board.squarePieceChar(move.from.index,board.state)
    
        ctx.clearRect(move.from.minX, move.from.minY, sqSize, sqSize);
        ctx.clearRect(move.to.minX, move.to.minY, sqSize, sqSize);

        ctx.fillStyle = move.from.moveFillStyle
        ctx.fillRect(move.from.minX, move.from.minY, sqSize, sqSize)

        ctx.fillStyle = move.to.moveFillStyle
        ctx.fillRect(move.to.minX, move.to.minY, sqSize, sqSize)

        const img = new Image(sqSize, sqSize); 
        img.src = `/img/${char}.svg`
        ctx.drawImage(img, move.to.minX,move.to.minY, sqSize, sqSize);
        
    }
}
export function updateBoardState(board,move) {

    const prevMove = move 
    prevMove.from.pieceChar = board.squarePieceChar(move.from.index,board.state)
    prevMove.to.pieceChar = board.squarePieceChar(move.to.index,board.state)
    board.setPrevMove = prevMove

    const moveObj = {from:move.from.notation,to:move.to.notation}
    board.setMove = moveObj
    
    const newState = board.swapPieces(move.from.index,move.to.index,board.state)
    board.setState = newState
}
export function promotion_animation(board,canvas,ctx,move){ 
    const sqSize = board.size/8
    const file = move.to.file
    canvas.draggable = false
    board.promoting = true

    const fromChar = board.squarePieceChar(move.from.index,board.state)
    
    const newState = board.swapPieces(move.from.index,move.to.index,board.state)
    board.setState = newState

    const promotionSquares = board.getPromotionSquares(fromChar,move)
    
    const difference = diffArr(board.sqCtx,promotionSquares)

    if(move.promotion){
        board.setMove = move
        board.setPrevMove = move
        const newState = board.promotePiece(move.promotion,move.to.index,board.state)
        board.setState = newState
   
        updatePromotedState(board,canvas,ctx,promotionSquares)
    }else{
        difference.forEach(sq =>{
            ctx.globalAlpha = .2
            ctx.fillStyle = sq.fillStyle
            ctx.clearRect(sq.minX, sq.minY, sqSize, sqSize);
            ctx.fillRect(sq.minX, sq.minY, sqSize, sqSize);
    
        })
    
        board.state.forEach((char,index) =>{
            if(char !== ""){
                
                function drawImageActualSize(){
                    ctx.globalAlpha = .2
                    ctx.drawImage(this, this.centerX, this.centerY, this.width, this.height);
                }
        
                const sq = board.returnSquareByIndex(index)
                const img = new Image(sqSize, sqSize); 
                img.src = `img/${char}.svg`
                img.centerX = sq.minX
                img.centerY = sq.minY
                img.onload = drawImageActualSize;
                
            }        
            
        })
        
        promotionSquares.forEach(sq => {
            ctx.globalAlpha = 1
            ctx.fillStyle = 'rgba(118, 205, 248, 0.8)'
            const img = new Image(sqSize, sqSize); 
            img.src = `/img/${sq.pieceChar}.svg`
            ctx.clearRect(sq.minX, sq.minY, sqSize, sqSize);
            ctx.fillRect(sq.minX, sq.minY, sqSize, sqSize)
            ctx.drawImage(img, sq.minX,sq.minY, sqSize, sqSize);
        })
        
        canvas.addEventListener('mousemove',mouse_move_handler(board,canvas,ctx,move,promotionSquares))
        canvas.addEventListener('click',mouse_click_handler(board,canvas,ctx,move,promotionSquares))
    }

     
    
}

export function soundAnimation(char){
    if(char === ""){     
        const audio = new Audio('/public_sound_standard_Move.mp3');
        audio.play();       
        
    }else{
        const audio = new Audio('/public_sound_standard_Capture.mp3');
        audio.play();
    }
 }

 export function updatePromotedState(board,canvas,ctx,promotionSquares) {
    
    if(board){
        promotionSquares = []
        canvas.removeEventListener('mousemove',mouse_move_handler)
        canvas.removeEventListener('click',mouse_click_handler)
        ctx.clearRect(0,0,canvas.width,canvas.height)
        board.promoting = false
        canvas.draggable = true

        const prevMove = board.prevMove
        
        const sqSize = board.size/8
        
        ctx.globalAlpha = 1

        board.sqCtx.forEach(sq => {
            ctx.fillStyle = sq.fillStyle
            ctx.clearRect(sq.minX, sq.minY, sqSize, sqSize);
            ctx.fillRect(sq.minX, sq.minY, sqSize, sqSize);
        })

        ctx.clearRect(prevMove.from.minX, prevMove.from.minY, sqSize, sqSize);
        ctx.clearRect(prevMove.to.minX, prevMove.to.minY, sqSize, sqSize);

        ctx.fillStyle = prevMove.from.moveFillStyle
        ctx.fillRect(prevMove.from.minX, prevMove.from.minY, sqSize, sqSize)

        ctx.fillStyle = prevMove.to.moveFillStyle
        ctx.fillRect(prevMove.to.minX, prevMove.to.minY, sqSize, sqSize)

        board.state.forEach((char,index) =>{
            if(char !== ""){
                function drawImageActualSize(){
                    ctx.drawImage(this, this.centerX, this.centerY, this.width, this.height);
                }

                const sq = board.returnSquareByIndex(index)
                const img = new Image(sqSize, sqSize); 
                img.src = `/img/${char}.svg`
                img.centerX = sq.minX
                img.centerY = sq.minY
                img.onload = drawImageActualSize;
            }
            
            
        })
    }
 }

export function isPiece(fromChar) {
    if (fromChar === "") return false
    return true
}
export function thatsYourPiece(board, fromChar) {
    if (board.orientation === 'w' && !board.whitePieces.includes(fromChar)) {
        return false;
    }
    if (board.orientation === 'b' && !board.blackPieces.includes(fromChar)) {
        return false;
    }    
    else return true
}
export function itsYourTurn(board, fromChar) {
    
    if (board.turn === true && !board.whitePieces.includes(fromChar)) {
        return false;
    }
    if (board.turn === false && !board.blackPieces.includes(fromChar)) {
        return false;
    }    
    else return true
}
 
export function makeSelect(board,ctx,selectedSquare) {
    if (board.pieceSelected === false) {
        const sqSize = board.size/8
        ctx.fillStyle = '#819669'
        ctx.clearRect(selectedSquare.minX, selectedSquare.minY, sqSize, sqSize);
        ctx.fillRect(selectedSquare.minX, selectedSquare.minY, sqSize, sqSize);
        const img = new Image(board.size/8,board.size/8); 
        const char = board.squarePieceChar(selectedSquare.index,board.state)
        img.src = `/img/${char}.svg`
        ctx.drawImage(img, selectedSquare.minX, selectedSquare.minY, sqSize, sqSize)
        board.pieceSelected = true
        board.selectedPiece = selectedSquare
    }else{return}
}
export function unSelect(board, ctx, selectedSquare) {
    const sqSize = board.size/8
    ctx.fillStyle = selectedSquare.fillStyle
    ctx.clearRect(selectedSquare.minX, selectedSquare.minY, sqSize, sqSize);
    ctx.fillRect(selectedSquare.minX, selectedSquare.minY, sqSize, sqSize);
    const img = new Image(board.size/8,board.size/8); 
    const char = board.squarePieceChar(selectedSquare.index,board.state)
    img.src = `/img/${char}.svg`
    ctx.drawImage(img, selectedSquare.minX, selectedSquare.minY, sqSize, sqSize)
    board.pieceSelected = false;
    board.selectedPiece = null;
}