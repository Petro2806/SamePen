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

    const handleCreate = async () => {
        const trimmedName = name.trim();
        if (trimmedName === "" || existingNames.includes(trimmedName)) {
            window.alert("Enter a unique profile name");
            return;
        }

        setLoading(true);
        try {
            const rules = samples.trim() === ""
                ? []
                : await extractStyleRules(samples);
            onSave({ name: trimmedName, styleRules: rules });
        } finally {
            setLoading(false);
        }
    };


    return <div className="card profile-form">
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
                        onClick={handleCreate}
                        disabled={loading}
                        >{loading ? "Analyzing..." : "Create"}</button>
                    <button
                        type="button"
                        className="profile-form__button profile-form__button--secondary"
                        onClick={onCancel}
                        disabled={loading}
                        >Cancel</button>
                </div>
            </div>;

};

export default ProfileForm;