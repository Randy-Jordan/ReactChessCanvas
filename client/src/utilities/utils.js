export function fenString(str){
    const firstSpaceIndex = str.indexOf(' ')
    const newString = str.slice(0,firstSpaceIndex)
    return newString
}

export function removeSlash(str){
    const string = str.replace(/\//g, "")
    return string
}

export function iterateString(str){
    let parsedString = []
    const regex = "\\d";
    for(let i=0; i < str.length; i++){
        str.charAt(i)
        const match = str.charAt(i).match(regex)
        
        if(match !=null){
            let x;
            x = parseInt(match[0])
            for(let i=0;i<x;i++){
                parsedString.push('')
                
            }
        } else {
            parsedString.push(str.charAt(i))
        }
    }
    
    return parsedString
}
export function createString(str){
    let parsedString = ''
    const regex = "\\d";
    for(let i=0; i < str.length; i++){
        str.charAt(i)
        const match = str.charAt(i).match(regex)
        
        if(match !=null){
                let x;
                x = parseInt(match[0])
                for(let i=0;i<x;i++){
                    parsedString += ' '
                
                }
        } else {
            parsedString += str.charAt(i)
                
            }
    }
    
    return parsedString
}

export function getBoardArray(fen) {
        const string = fenString(fen)
        const newString = removeSlash(string)
        const boardArray = iterateString(newString)
        return boardArray
}

export function diffArr(arr1,arr2) {
    let res = []
    res = arr1.filter(el => {
        return !arr2.find(element => {
           return element.notation === el.notation;
        });
     });
     return res;

}
