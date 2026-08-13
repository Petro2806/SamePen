const OLLAMA_URL = process.env.REACT_APP_OLLAMA_URL || "http://localhost:11434/api/chat";
const MODEL = process.env.REACT_APP_OLLAMA_MODEL || "llama3.2";

export type OllamaCheck =
    | {ok: true}
    | {ok: false, message: string};

function tagsUrl(): string {
    return new URL("/api/tags", OLLAMA_URL).toString();
}

export async function checkOllama(): Promise<OllamaCheck> {
    let installed: string[];

    try {
        const response = await fetch(tagsUrl());
        if (!response.ok) {
            return {
                ok: false,
                message: `Ollama answered with status ${response.status}. Check that it is healthy and try again.`
            };
        }

        const data = await response.json();
        installed = (data.models ?? []).map((model: {name: string}) => model.name);
    } catch (error) {
        console.warn("Could not reach Ollama", error);
        return {
            ok: false,
            message: `Could not reach Ollama at ${OLLAMA_URL}. Start it with "ollama serve" and try again.`
        };
    }

    if (!installed.includes(MODEL) && !installed.includes(`${MODEL}:latest`)) {
        return {
            ok: false,
            message: `Ollama is running, but the model "${MODEL}" is not installed. Run "ollama pull ${MODEL}" and try again.`
        };
    }

    return {ok: true};
}

export async function askOllama(system: string, prompt: string): Promise<string> {
    const response = await fetch(OLLAMA_URL,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(
                {
                    model: MODEL,
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