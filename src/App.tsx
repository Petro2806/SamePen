import React from 'react';
import './App.css';
import InputCard from "./components/InputCard"
import ToneCard from "./components/ToneCard"
import ResultCard from "./components/ResultCard"
import logo from "./logos/logo.svg"

function App() {
  return (
    <div className="App">
      <header className="header">
        <img src={logo} alt="" className="header__logo" />
        <span className="brand">ReTone</span>
      </header>

      <main className="main">
        <div className="input-column">
          <InputCard />
          <ToneCard />
        </div>

        <div className="results">
          <ResultCard title="Light edit" />
          <ResultCard title="Full rewrite" variant="sage" />
        </div>
      </main>
    </div>
  );
}

export default App;
