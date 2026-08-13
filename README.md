# SamePen

Rewrite a message in your own voice, without sending it to the cloud.

You paste the message you are replying to, your rough draft, and set two tone
sliders. SamePen gives you back two versions: a **light edit** that keeps your
wording almost intact, and a **full rewrite** that is free to restructure. Both
of them try to sound like *you*, not like a chatbot.

Everything runs on a local [Ollama](https://ollama.com) instance. Your
drafts never leave your machine.

## Voice profiles

A profile is a short list of style rules - "signs off with cheers", "keeps
sentences under ten words", "never uses exclamation marks". You can paste a few
of your real messages and let the model distill the rules for you, then edit,
add or delete any of them by hand. The active profile is injected into every
rewrite. Profiles are stored in your browser's local storage.

## Requirements

- Node.js 18+
- [Ollama](https://ollama.com) running locally with at least one model pulled.

You can download a small model that doesn't need a lot of computer resources:
```bash
ollama pull llama3.2
ollama serve
```

## Getting started

```bash
npm install
npm start
```

The dev server runs on [http://localhost:3000](http://localhost:3000).

SamePen talks to Ollama on `http://localhost:11434` and expects the model
`llama3.2` by default. On startup it checks that Ollama is reachable and that
the model is there, so you will know right away if something is off.

## Configuration

Both the Ollama endpoint and the model are read from environment variables and
fall back to the local defaults. Copy the example file and edit it if you run
Ollama elsewhere or prefer another model:

```bash
cp .env.example .env.local
```

| Variable | Default | What it is |
| --- | --- | --- |
| `REACT_APP_OLLAMA_URL` | `http://localhost:11434/api/chat` | Ollama chat endpoint |
| `REACT_APP_OLLAMA_MODEL` | `llama3.2` | Model used for rewrites and style analysis |

## Status

A learning project, built to get better at React and TypeScript. It works, and
it is still growing. Also I will host the same project with better models and better prompts at [samepen.app](https://samepen.app).
