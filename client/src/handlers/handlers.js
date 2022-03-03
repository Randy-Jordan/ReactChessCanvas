import {move_logic,updatePromotedState,thatsYourPiece,makeSelect, unSelect, itsYourTurn, isPiece} from '../logic/logic'

export function dragstart_handler(board){

    return function eventHandler(ev) {
        const selectedSquare = board.returnSquareByCtx(ev.layerX,ev.layerY)
        const fromChar = board.squarePieceChar(selectedSquare.index,board.state)

        if (board.orientation === 'white' && !board.whitePieces.includes(fromChar) || board.orientation === 'black' && !board.blackPieces.includes(fromChar)){
        ev.preventDefault()
    }
        
    if(board.turn === true && !board.whitePieces.includes(fromChar) || board.turn === false && !board.blackPieces.includes(fromChar)){
        ev.preventDefault()
        
    } else{
        const img = new Image(board.size/8,board.size/8); 
        const char = board.squarePieceChar(selectedSquare.index,board.state)
        img.src = `/img/${char}.svg`
        ev.dataTransfer.effectAllowed = "move"
        ev.dataTransfer.setDragImage(img,20,20);
        ev.dataTransfer.setData("text/plain",JSON.stringify({from:selectedSquare}));
        }
    }
    
}

export function dragover_handler() {
    return function eventHandler(ev) {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move"
            const data = JSON.parse(ev.dataTransfer.getData("text"));
        
    }
}

export function drop_handler(board,canvas,ctx) {
    return function eventHandler(ev){
        
            ev.preventDefault();
            const data = JSON.parse(ev.dataTransfer.getData("text"));
            data.to = board.returnSquareByCtx(ev.layerX,ev.layerY)
            let move = {from:data.from, to: data.to}
            if(board.pieceBool(move.from.index,board.state) === false || data.from.notation === data.to.notation){
                return
            }else{   
                move_logic(board,canvas,ctx,move)
                
        }
    }
}
export function mouse_move_handler(board,canvas,ctx,move,promotionSquares) {
    const sqSize = board.size/8
    
    return function eventHandler(ev){
        if(board.promoting === true){
            const mouseSqIndex = board.returnSquareByCtx(ev.layerX,ev.layerY).index
            const selectedSquare = promotionSquares.find(sq => sq.index === mouseSqIndex)
        
        if(selectedSquare === undefined)return
        const otherSquares = promotionSquares.filter(sq => sq.notation !== selectedSquare.notation)

        otherSquares.forEach(sq => {
            ctx.globalAlpha = .5
            ctx.fillStyle = 'rgba(118, 205, 248, 0.8)'
            const img = new Image(sqSize, sqSize); 
            img.src = `/img/${sq.pieceChar}.svg`
            ctx.clearRect(sq.minX, sq.minY, sqSize, sqSize);
            ctx.fillRect(sq.minX, sq.minY, sqSize, sqSize)
            ctx.drawImage(img, sq.minX,sq.minY, sqSize, sqSize);
        })

        ctx.globalAlpha = 1
        ctx.fillStyle = 'rgba(118, 205, 248, 0.8)'
        const img = new Image(sqSize, sqSize); 
        img.src = `/img/${selectedSquare.pieceChar}.svg`
        ctx.clearRect(selectedSquare.minX, selectedSquare.minY, sqSize, sqSize);
        ctx.fillRect(selectedSquare.minX, selectedSquare.minY, sqSize, sqSize)
        ctx.drawImage(img, selectedSquare.minX,selectedSquare.minY, sqSize, sqSize);
        }

    }
 }

export function mouse_click_handler(board,canvas,ctx,move,promotionSquares){
    const sqSize = board.size/8
    return function eventHandler(ev){
        if(board.promoting === true){
            const mouseSqIndex = board.returnSquareByCtx(ev.layerX,ev.layerY).index
            const selectedSquare = promotionSquares.find(sq => sq.index === mouseSqIndex)
            if(selectedSquare){
                const moveObj = {from: move.from.notation, to: move.to.notation, promotion:selectedSquare.pieceChar}
                board.setMove = moveObj
                board.setPrevMove = move
                const newState = board.promotePiece(selectedSquare.pieceChar,move.to.index,board.state)
                board.setState = newState
           
                updatePromotedState(board,canvas,ctx,promotionSquares)
            }
            
        }
        
    }
    
} 

export function click_handler(board, canvas, ctx) {
    return function (ev) {
        
        if (!board.pieceSelected) {
            const selectedSquare = board.returnSquareByCtx(ev.layerX, ev.layerY);
            const fromChar = board.squarePieceChar(selectedSquare.index,board.state)
                if (isPiece(fromChar) && !board.promoting) {
                    makeSelect(board,ctx,selectedSquare)
            } 
        } else {
            const toSquare = board.returnSquareByCtx(ev.layerX, ev.layerY);
            const move = { from: board.selectedPiece, to: toSquare };
            
            if (move.from.notation === move.to.notation && !board.promoting) {
                unSelect(board, ctx, board.selectedPiece);
                return
            }
            unSelect(board, ctx, board.selectedPiece)
            move_logic(board, canvas, ctx, move)
            
            
            
        }
        
    }
}

