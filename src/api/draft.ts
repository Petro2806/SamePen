import { RewriteResult } from "./rewrite";

export type SavedDraft = {
    replyTo: string;
    draft: string;
    directness: number;
    warmth: number;
    result: RewriteResult | null;
};

const DRAFT_KEY = "draft";

const EMPTY_DRAFT: SavedDraft = {
    replyTo: "",
    draft: "",
    directness: 50,
    warmth: 70,
    result: null,
};

export function loadDraft(): SavedDraft {
    const draftData = localStorage.getItem(DRAFT_KEY);
    if (!draftData) {
        return {...EMPTY_DRAFT};
    }

    try {
        return {...EMPTY_DRAFT, ...JSON.parse(draftData)};
    } catch (error) {
        console.warn("Stored draft is corrupted, starting fresh", error);
        return {...EMPTY_DRAFT};
    }
}

export function saveDraft(draft: SavedDraft): void {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}
