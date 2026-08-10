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

type Screen = "main" | "createProfile" | "editProfile";

function App() {
  const [profiles, setProfiles] = useState<VoiceProfile[]>(() => loadProfiles());
  const [activeProfileName, setActiveProfileName] = useState<string | null>(() => loadActiveProfileName());
  const [replyTo, setReplyTo] = useState("");
  const [draft, setDraft] = useState("");
  const [directness, setDirectness] = useState(50);
  const [warmth, setWarmth] = useState(70);
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState<Screen>("main");

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

  const editedProfile = screen === "editProfile" ? activeProfile : null;

  const handleSelectProfile = (name: string | null) => {
      setActiveProfileName(name);
      setScreen("main");
  };

  const handleSaveProfile = (profile: VoiceProfile) => {
      if (editedProfile) {
        setProfiles(profiles.map(p => (p.name === editedProfile.name ? profile : p)));
      }
      else {
        setProfiles([...profiles, profile]);
      }
      setActiveProfileName(profile.name);
      setScreen("main");
  };

  const handleDeleteProfile = () => {
      if (!activeProfile || !window.confirm(`Delete profile "${activeProfile.name}"?`)) {
        return;
      }
      setProfiles(profiles.filter(p => p.name !== activeProfile.name));
      setActiveProfileName(null);
      setScreen("main");
  };

  return (
    <div className="App">
      <header className="header">
        <img src={logo} alt="" className="header__logo" />
        <span className="brand">ReTone</span>

        <ProfileSelect
          profiles={profiles}
          activeName={activeProfileName}
          onSelect={handleSelectProfile}
          onAdd={() => setScreen("createProfile")}
          onEdit={() => setScreen("editProfile")}
          onDelete={handleDeleteProfile}
        />
      </header>

      <main className="main">
        {screen !== "main" &&
          (
            <ProfileForm
                initial={editedProfile}
                existingNames={profiles.filter(p => p !== editedProfile).map(p => p.name)}
                onSave={handleSaveProfile}
                onCancel={() => setScreen("main")}
            />
          )
        }
        {screen === "main" &&
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
