import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  function doShit() {
    console.log('do shit')
  }

  return (
    <div className="App">
      <button onClick={doShit}>test</button>
    </div>
  );
}

export default App;
