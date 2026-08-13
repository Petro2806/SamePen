import React, { useState } from "react"
import './ResultCard.css'

type ResultCardProps = {
    title: string;
    text: string | null;
    loading: boolean;
    variant?: "sage";
};

const ResultCard = ({ title, text, loading, variant }: ResultCardProps) => {
    const [copied, setCopied] = useState(false);

    let cardClass = "card result-card";
    if (variant === "sage") {
        cardClass += " result-card--sage";
    }

    const handleCopy = async () => {
        if (text === null) {
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            console.warn("Could not copy the rewrite", error);
            window.alert("Could not copy the text");
        }
    };

    return <div className={cardClass}>
        <div className="result-card__header">
            <span className="result-card__title">{title}</span>
            <button
                type="button"
                className="result-card__copy"
                onClick={handleCopy}
                disabled={text === null || loading}
                >{copied ? "Copied" : "Copy"}</button>
        </div>
        {loading
            ? <p className="result-card__text result-card__text--pending">Rewriting…</p>
            : <p className="result-card__text">{text ?? "Your rewrite will appear here"}</p>
        }
    </div>;
};

export default ResultCard;
