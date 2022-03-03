import React,{useRef} from 'react'
import { useEffect } from 'react'
import CanvasBoard from './classes/CanvasBoard'
import { dragover_handler,dragstart_handler,drop_handler,click_handler } from './handlers/handlers'
const Canvas = (props) => {
    const { id = 'needsId', width = 600, draggable = false ,fen='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',orientation='w',onDrop=null} = props
    const canvasRef = useRef(null)
    
    useEffect(() => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const board = new CanvasBoard(width, fen, orientation,onDrop)
      const sqSize = width / 8
  
      board.sqCtx.forEach(sq =>{
        ctx.fillStyle = sq.fillStyle
        ctx.fillRect(sq.minX, sq.minY, sqSize, sqSize);
      })

      board.state.forEach((char,index) =>{
        board.drawPieces(ctx,char,index)
        
    })
      
      canvas.addEventListener('dragstart',dragstart_handler(board,canvas))
      canvas.addEventListener('dragover',dragover_handler(board))
      canvas.addEventListener('drop', drop_handler(board, canvas, ctx))
      canvas.addEventListener('click',click_handler(board,canvas,ctx))
      
    }, [id,width,draggable,fen,orientation,onDrop])
    
  return (
    <canvas id={id} width={width} height={width} draggable={draggable}ref={canvasRef}></canvas>
  )
}



export default Canvas