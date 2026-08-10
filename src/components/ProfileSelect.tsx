import { VoiceProfile } from "../api/profile";
import './ProfileSelect.css'

type ProfileSelectProps = {
    profiles: VoiceProfile[];
    activeName: string | null;
    onSelect: (name: string | null) => void;
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

const ProfileSelect = ({profiles, activeName, onSelect, onAdd, onEdit, onDelete}: ProfileSelectProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "__new__") {
            onAdd();
            return;
        }
        onSelect(value === "" ? null : value);
    };

    return <div className="profile-select">
                <select
                    className="profile-select__dropdown"
                    value={activeName ?? ""}
                    onChange={handleChange}
                    >
                        <option value="">No profile</option>
                        {
                            profiles.map(
                                p => (
                                    <option key={p.name} value={p.name}>{p.name}</option>
                                )
                            )
                        }
                    <option value="__new__">+ New profile…</option>
                </select>
                {activeName &&
                    <>
                        <button
                            type="button"
                            className="profile-select__button"
                            onClick={onEdit}
                            >Edit</button>
                        <button
                            type="button"
                            className="profile-select__button profile-select__button--danger"
                            onClick={onDelete}
                            >Delete</button>
                    </>
                }
            </div>
};


export default ProfileSelect;
