import React from "react"
import './InputCard.css'

const InputCard = () => {
    return <div className="card">
        <div>
            <span className="input-card__text">Replying to (optional)</span>
            <textarea className="input-card__box" rows={4} placeholder="Enter the message you are replying to"/>
        </div>

        <div>
            <span className="input-card__text">Your draft</span>
            <textarea className="input-card__box" rows={6} placeholder="Enter the message you want to rewrite"/>
        </div>
    </div>;
};

export default InputCard;
