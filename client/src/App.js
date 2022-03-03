import Canvas from './Canvas';

function App() {

  function onDrop(move){
    console.log(move)
  }

  return (
    <Canvas id={'newCanvas'} draggable={true}onDrop={onDrop}/>
  );
}

export default App;
