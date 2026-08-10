const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL = "llama3.2";
//const MODEL = "qwen2.5:7b";


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