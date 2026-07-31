import React, {useState} from 'react';
import {rewrite, RewriteResult} from './api/rewrite'
import './App.css';
import InputCard from "./components/InputCard"
import ToneCard from "./components/ToneCard"
import ResultCard from "./components/ResultCard"
import logo from "./logos/logo.svg"

function App() {
  const [replyTo, setReplyTo] = useState("");
  const [draft, setDraft] = useState("");
  const [directness, setDirectness] = useState(50);
  const [warmth, setWarmth] = useState(70);
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleRewriteButton = async () => {
    setLoading(true);
    try {
      const res = await rewrite({replyTo, draft, directness, warmth});
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <img src={logo} alt="" className="header__logo" />
        <span className="brand">ReTone</span>
      </header>

      <main className="main">
        <div className="input-column">
          <InputCard 
            replyTo={replyTo}
            onReplyToChange={setReplyTo} 
            draft={draft} 
            onDraftChange={setDraft}
          />
          <ToneCard 
            directness={directness}
            onDirectnessChange={setDirectness}
            warmth={warmth}
            onWarmthChange={setWarmth}
            loading={loading}
            onRewrite={handleRewriteButton}
          />
        </div>

        <div className="results">
          <ResultCard title="Light edit" text={result ? result.lightEdit : null}/>
          <ResultCard title="Full rewrite" text={result ? result.fullRewrite : null} variant="sage" />
        </div>
      </main>
    </div>
  );
}

export default App;
