import React, {useState, useEffect} from 'react';
import {rewrite, RewriteResult} from './api/rewrite'
import { loadActiveProfileName, saveActiveProfileName, loadProfiles, saveProfiles, VoiceProfile} from './api/profile';
import './App.css';
import InputCard from "./components/InputCard"
import ToneCard from "./components/ToneCard"
import ResultCard from "./components/ResultCard"
import logo from "./logos/logo.svg"
import ProfileSelect from './components/ProfileSelect';
import ProfileForm from "./components/ProfileForm";

function App() {
  const [profiles, setProfiles] = useState<VoiceProfile[]>(() => loadProfiles());
  const [activeProfileName, setActiveProfileName] = useState<string | null>(() => loadActiveProfileName());
  const [replyTo, setReplyTo] = useState("");
  const [draft, setDraft] = useState("");
  const [directness, setDirectness] = useState(50);
  const [warmth, setWarmth] = useState(70);
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [creatingProfile, setCreatingProfile] = useState(false);

  useEffect(() => {
    saveProfiles(profiles);
  }, [profiles]);

  useEffect(() => {
    saveActiveProfileName(activeProfileName);
  }, [activeProfileName]);

  const activeProfile = profiles.find(p => p.name === activeProfileName) ?? null;

  const handleRewriteButton = async () => {
    setLoading(true);
    try {
      const res = await rewrite({profile: activeProfile, replyTo, draft, directness, warmth});
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfile = () => setCreatingProfile(true);

  const handleSaveProfile = (profile: VoiceProfile) => {
      setProfiles([...profiles, profile]);
      setActiveProfileName(profile.name);
      setCreatingProfile(false);
  };

  return (
    <div className="App">
      <header className="header">
        <img src={logo} alt="" className="header__logo" />
        <span className="brand">ReTone</span>

        <ProfileSelect 
          profiles={profiles}
          activeName={activeProfileName}
          onSelect={setActiveProfileName}
          onAdd={handleAddProfile}
        />
      </header>

      <main className="main">
        {creatingProfile && 
          (
            <ProfileForm
                existingNames={profiles.map(p => p.name)}
                onSave={handleSaveProfile}
                onCancel={() => setCreatingProfile(false)}
            />
          )
        }
        {!creatingProfile &&
          (
            <>
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
            </>
          )
        }
      </main>
    </div>
  );
}

export default App;
