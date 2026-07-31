export type VoiceProfile = {
    name: string;
    styleRules: string[];
};


const PROFILES_KEY = "profiles";
const ACTIVE_PROFILE_KEY = "active_profile";

export function loadProfiles(): VoiceProfile[] {
    const profilesData = localStorage.getItem(PROFILES_KEY);
    if (!profilesData) {
        return [];
    }

    try {
        return JSON.parse(profilesData);
    } catch (error) {
        console.warn("Stored profiles are corrupted, starting fresh", error);
        return [];
    }
}

export function saveProfiles(profiles: VoiceProfile[]): void {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function loadActiveProfileName(): string | null {
    const activeProfile = localStorage.getItem(ACTIVE_PROFILE_KEY);
    if (!activeProfile) {
        return null;
    }

    try {
        return JSON.parse(activeProfile);
    } catch (error) {
        console.warn("Stored active profile is corrupted, choosing default", error);
        return null;
    }
}

export function saveActiveProfileName(name: string | null): void { 
    if(name) {
        localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(name));
    }
    else {
        localStorage.removeItem(ACTIVE_PROFILE_KEY);
    }
}