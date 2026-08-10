import { useState } from 'react';
import { VoiceProfile, extractStyleRules } from "../api/profile";
import './ProfileForm.css';

type ProfileFormProps = {
    existingNames: string[];
    onSave: (profile: VoiceProfile) => void;
    onCancel: () => void;
};

const ProfileForm = ({existingNames, onSave, onCancel}: ProfileFormProps) => {
    const [name, setName] = useState("");
    const [samples, setSamples] = useState("");
    const [loading, setLoading] = useState(false);
    const [rules, setRules] = useState<string[]>([]);

    const handleGenerate = async () => {
        if (samples.trim() === "") {
            window.alert("Paste a few writing samples first");
            return;
        }
        if (rules.length > 0 && !window.confirm("Generated rules will replace the current ones. Continue?")) {
            return;
        }

        setLoading(true);
        try {
            setRules(await extractStyleRules(samples));
        } catch (error) {
            console.warn("Could not extract style rules", error);
            window.alert("Could not get the rules. Is Ollama running?");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        const trimmedName = name.trim();
        if (trimmedName === "" || existingNames.includes(trimmedName)) {
            window.alert("Enter a unique profile name");
            return;
        }
        onSave({
            name: trimmedName,
            styleRules: rules.map(r => r.trim()).filter(r => r !== ""),
        });
    };

    const handleRuleChange = (index: number, value: string) => {
        setRules(rules.map((r, i) => (i === index ? value : r)));
    };

    const handleRuleDelete = (index: number) => {
        setRules(rules.filter((_, i) => i !== index));
    };

    return <div className="profile-form">
                <div className="card profile-form__card">
                    <span className="profile-form__title">New tone profile</span>
                    <div>
                        <span className="profile-form__label">Profile name</span>
                        <input
                            type="text"
                            className="profile-form__name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Work, Casual, Sasha"
                        />
                    </div>
                    <div>
                        <span className="profile-form__label">Writing samples</span>
                        <textarea
                            className="profile-form__samples"
                            rows={11}
                            value={samples}
                            onChange={(e) => setSamples(e.target.value)}
                            placeholder={
                                "Paste a few of your real messages - the more, " +
                                "the better the style rules. \n" +
                                "Divide each message with your usual sentence endings"
                            }
                        />
                    </div>
                    <div className="profile-form__actions">
                        <button
                            type="button"
                            className="profile-form__button profile-form__button--primary"
                            onClick={handleGenerate}
                            disabled={loading}
                            >{loading ? "Analyzing..." : (rules.length > 0 ? "Regenerate rules" : "Generate rules")}</button>
                        <button
                            type="button"
                            className="profile-form__button profile-form__button--secondary"
                            onClick={onCancel}
                            disabled={loading}
                            >Cancel</button>
                    </div>
                </div>

                <div className="card profile-form__rules">
                    <span className="profile-form__title">Style rules</span>
                    {rules.length === 0 &&
                        <span className="profile-form__hint">
                            Generate the rules from your samples, or write them yourself
                        </span>
                    }
                    <div className="profile-form__rules-list">
                        {rules.map((rule, index) => (
                            <div className="profile-form__rule" key={index}>
                                <span className="profile-form__rule-number">{index + 1}</span>
                                <input
                                    className="profile-form__rule-input"
                                    value={rule}
                                    onChange={(e) => handleRuleChange(index, e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="profile-form__rule-delete"
                                    onClick={() => handleRuleDelete(index)}
                                    >×</button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="profile-form__button profile-form__button--secondary"
                        onClick={() => setRules([...rules, ""])}
                        >+ Add rule</button>
                    <button
                        type="button"
                        className="profile-form__button profile-form__button--primary"
                        onClick={handleSave}
                        disabled={loading}
                        >Save profile</button>
                </div>
            </div>;
};

export default ProfileForm;
