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

export type VoiceProfile = {
    name: string;
    styleRules: string[];
};

async function askOllama(system: string, prompt: string): Promise<string> {
    const response = await fetch("http://localhost:11434/api/chat",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(
                {
                    model: "llama3.2",
                    stream: false,
                    messages: [
                        {role: "system", content: system},
                        {role: "user", content: prompt}
                    ]
                }
            )
        }
    );

    if (!response.ok) {
        throw new Error(`Ollama responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.message.content.trim();
} 

function buildSystem(profile: VoiceProfile | null, variant: "light" | "full"): string {
    let result =  "You are an editor who preserves the writer's voice. " +
                    "The user will provide optional context (a message the writer is replying to) " +
                    "and the writer's draft. Rewrite ONLY the draft. " +
                    "Never rewrite, answer or continue the context message. ";

    if (profile) {
        result += "The writer's style profile:\n- " + profile.styleRules.join("\n- ") + "\n";
    }

    if (variant === "light") {
        result +=   "Rewrite the draft changing as little as possible: " +
                    "keep the wording, casing and punctuation style, " +
                    "only adjust the tone according to the tone settings and fix what truly hurts clarity. " +
                    "Reply with the rewritten draft only - no explanations, no quotes, no delimiters.";
    }
    else {
        result +=   "Rewrite the draft freely: you may restructure sentences and reorder ideas, " +
                    "but keep the meaning and the writer's personal style. Apply the tone settings. " +
                    "Reply with the rewritten draft only - no explanations, no quotes, no delimiters.";
    }
    return result;
}

function buildPrompt(request: RewriteRequest): string {
    let result = "";
    if (request.replyTo.trim() !== "") {
        result +=   "Context - the writer is replying to this message (do not rewrite it):\n" +
                    '"""\n' + request.replyTo.trim() + '\n"""\n\n';
    }
    result +=   "Tone settings for the rewrite:\n" +
                `- directness=${request.directness} (0 = hint gently, 100 = say it straight)\n` +
                `- warmth=${request.warmth} (0 = dry & neutral, 100 = warm & friendly)\n\n` +
                "The writer's draft to rewrite:\n" +
                '"""\n' + request.draft + '\n"""';
    return result;
}

export async function rewrite(request: RewriteRequest): Promise<RewriteResult> {
    const lightSystem = buildSystem(null, "light");
    const fullSystem = buildSystem(null, "full");
    const prompt = buildPrompt(request);

    const [lightEdit, fullRewrite] = await Promise.all(
        [
            askOllama(lightSystem, prompt),
            askOllama(fullSystem, prompt)
        ]
    );

    return { lightEdit, fullRewrite };
}