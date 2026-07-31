export type RewriteRequest = {
    replyTo: string;
    draft: string;
    directness: number; 
    warmth: number;
};

export type RewriteResult = {
    lightEdit: string;
    fullRewrite: string;
};

export async function rewrite(request: RewriteRequest): Promise<RewriteResult> {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    
    const lightEdit = request.draft;
    const exclamations = "!".repeat(Math.round(request.warmth / 20));
    const fullRewrite = lightEdit + exclamations;

    return { lightEdit, fullRewrite };
}