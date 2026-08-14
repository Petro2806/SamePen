import React, {useState, useEffect} from 'react';
import {rewrite, RewriteResult} from './api/rewrite'
import { loadActiveProfileName, saveActiveProfileName, loadProfiles, saveProfiles, VoiceProfile} from './api/profile';
import { loadDraft, saveDraft } from './api/draft';
import './App.css';
import InputCard from "./components/InputCard"
import ToneCard from "./components/ToneCard"
import ResultCard from "./components/ResultCard"
import logo from "./logos/logo.svg"
import ProfileSelect from './components/ProfileSelect';
import ProfileForm from "./components/ProfileForm";
import StartGate from "./components/StartGate";
import { checkOllama, loadOllamaChecked, saveOllamaChecked } from './api/ollama';

type Screen = "main" | "createProfile" | "editProfile";

const SAVE_DRAFT_DELAY_MS = 500;

function App() {
  const [restored] = useState(loadDraft);
  const [profiles, setProfiles] = useState<VoiceProfile[]>(() => loadProfiles());
  const [activeProfileName, setActiveProfileName] = useState<string | null>(() => loadActiveProfileName());
  const [replyTo, setReplyTo] = useState(restored.replyTo);
  const [draft, setDraft] = useState(restored.draft);
  const [directness, setDirectness] = useState(restored.directness);
  const [warmth, setWarmth] = useState(restored.warmth);
  const [result, setResult] = useState<RewriteResult | null>(restored.result);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>("main");
  const [started, setStarted] = useState(loadOllamaChecked);
  const [checking, setChecking] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  useEffect(() => {
    saveProfiles(profiles);
  }, [profiles]);

  useEffect(() => {
    saveActiveProfileName(activeProfileName);
  }, [activeProfileName]);

  useEffect(() => {
    const save = () => saveDraft({replyTo, draft, directness, warmth, result});

    const timer = window.setTimeout(save, SAVE_DRAFT_DELAY_MS);
    window.addEventListener("pagehide", save);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pagehide", save);
    };
  }, [replyTo, draft, directness, warmth, result]);

  const activeProfile = profiles.find(p => p.name === activeProfileName) ?? null;

  const handleRewriteButton = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rewrite({profile: activeProfile, replyTo, draft, directness, warmth});
      setResult(res);
    } catch (err) {
      console.warn("Could not rewrite the draft", err);
      setError("Could not rewrite the draft. Check that Ollama is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartButton = async () => {
    setChecking(true);
    setStartError(null);
    try {
      const check = await checkOllama();
      if (check.ok) {
        saveOllamaChecked(true);
        setStarted(true);
      }
      else {
        setStartError(check.message);
      }
    } finally {
      setChecking(false);
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
        <span className="brand">SamePen</span>

        {started &&
          (
            <ProfileSelect
              profiles={profiles}
              activeName={activeProfileName}
              onSelect={handleSelectProfile}
              onAdd={() => setScreen("createProfile")}
              onEdit={() => setScreen("editProfile")}
              onDelete={handleDeleteProfile}
            />
          )
        }
      </header>

      <main className="main">
        {!started &&
          (
            <StartGate
              checking={checking}
              error={startError}
              onStart={handleStartButton}
            />
          )
        }
        {started && screen !== "main" &&
          (
            <ProfileForm
                initial={editedProfile}
                existingNames={profiles.filter(p => p !== editedProfile).map(p => p.name)}
                onSave={handleSaveProfile}
                onCancel={() => setScreen("main")}
            />
          )
        }
        {started && screen === "main" &&
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
                {error &&
                  (
                    <div className="error-banner">
                      <span>{error}</span>
                      <button
                        type="button"
                        className="error-banner__close"
                        onClick={() => setError(null)}
                        >×</button>
                    </div>
                  )
                }
              </div>

              <div className="results">
                <ResultCard title="Light edit" text={result ? result.lightEdit : null} loading={loading}/>
                <ResultCard title="Full rewrite" text={result ? result.fullRewrite : null} loading={loading} variant="sage" />
              </div>
            </>
          )
        }
      </main>
    </div>
  );
}

export default App;
