import React from "react"
import './ResultCard.css'

type ResultCardProps = {
    title: string;
    text?: string;
    variant?: "sage";
};

const ResultCard = ({ title, text, variant }: ResultCardProps) => {
    let cardClass = "card result-card";
    if (variant === "sage") {
        cardClass += " result-card--sage";
    }

    return <div className={cardClass}>
        <span className="result-card__title">{title}</span>
        <p className="result-card__text">
            {text ?? "Your rewrite will appear here"}
        </p>
    </div>;
};

export default ResultCard;
