import React from 'react';
import './App.css';
import InputCard from "./components/InputCard"
import ToneCard from "./components/ToneCard"

function App() {
  return (
    <div className="App">
      <header className="header">
        <span className="brand">ReTone</span>
      </header>

      <main className="main">
        <div className="input-column">
          <InputCard />
          <ToneCard /> 
        </div>
      </main>
    </div>
  );
}

export default App;
