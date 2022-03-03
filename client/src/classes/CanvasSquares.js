export default class CanvasSquares {
    constructor(minX,maxX,minY,maxY,notation,color,fillStyle,moveFillStyle,index) {
      this.minX = minX;
      this.maxX = maxX;
      this.minY = minY;
      this.maxY = maxY;
      this.notation = notation;
      this.color = color;
      this.fillStyle = fillStyle;
      this.moveFillStyle = moveFillStyle;
      this.index = index;
      
    }

    get centerX(){
        return (this.minX+this.maxX)/2
    }
    get centerY(){
        return (this.minY+this.maxY)/2
    }
    get rank(){
        
        return this.notation.charAt(1)
    }
    get file(){
        return this.notation.charAt(0)
    }
    

  }