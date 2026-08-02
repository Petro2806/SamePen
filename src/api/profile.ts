import { askOllama } from "./ollama";

export type VoiceProfile = {
    name: string;
    styleRules: string[];
};


const PROFILES_KEY = "profiles";
const ACTIVE_PROFILE_KEY = "active_profile";

const ANALYZE_SYSTEM =
    "You are a writing style analyst. The user will provide samples of one person's writing. " +
    "Identify the writer's distinctive habits: greetings and sign-offs, capitalization, " +
    "punctuation, sentence length, formality, emoji usage, favorite words and expressions. " +
    "Reply with 3-9 short rules. Each rule is a concrete instruction for imitating this style. " +
    "Example of good rules (for a different writer):\n" +
    "signs off with cheers\n" +
    "keeps sentences under ten words\n" +
    "uses ellipses... instead of commas\n\n" +
    "Write one rule per line. No numbering, no bullets, no headers, no other text. " +
    "Only include rules the samples actually show - do not invent or guess. " +
    "Each rule must describe a different habit - no duplicates or rephrasings of the same rule.";


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

export async function extractStyleRules(samples: string): Promise<string[]> {
    const answer = await askOllama(ANALYZE_SYSTEM, 
        'Here are the writing samples:\n"""\n' + samples + '\n""" ');

    return answer
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== ""); 
}
