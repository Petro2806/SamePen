import { useState } from 'react';
import { VoiceProfile, extractStyleRules } from "../api/profile";
import './ProfileCreate.css';

type ProfileCreateProps = {
    existingNames: string[];
    onCreate: (profile: VoiceProfile) => void;
    onCancel: () => void;
};

const ProfileCreate = ({existingNames, onCreate, onCancel}: ProfileCreateProps) => {
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
            onCreate({ name: trimmedName, styleRules: rules });
        } finally {
            setLoading(false);
        }
    };


    return <div className="card profile-create">
                <span className="profile-create__title">New tone profile</span>
                <div>
                    <span className="profile-create__label">Profile name</span>
                    <input
                        type="text"
                        className="profile-create__name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Work, Casual, Sasha"
                    />
                </div>
                <div>
                    <span className="profile-create__label">Writing samples</span>
                    <textarea
                        className="profile-create__samples"
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
                <div className="profile-create__actions">
                    <button
                        type="button"
                        className="profile-create__button profile-create__button--primary"
                        onClick={handleCreate}
                        disabled={loading}
                        >{loading ? "Analyzing..." : "Create"}</button>
                    <button
                        type="button"
                        className="profile-create__button profile-create__button--secondary"
                        onClick={onCancel}
                        disabled={loading}
                        >Cancel</button>
                </div>
            </div>;

};

export default ProfileCreate;