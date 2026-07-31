import React from "react"
import './InputCard.css'

type InputCardProps = {
    replyTo: string;
    onReplyToChange: (value: string) => void;
    draft: string;
    onDraftChange: (value: string) => void;
}

const InputCard = ({replyTo, onReplyToChange, draft, onDraftChange}: InputCardProps) => {
    return <div className="card">
        <div>
            <span className="input-card__text">Replying to (optional)</span>
            <textarea 
                className="input-card__box" 
                rows={4} 
                value={replyTo}
                onChange={(e) => onReplyToChange(e.target.value)}
                placeholder="Enter the message you are replying to"/>
        </div>

        <div>
            <span className="input-card__text">Your draft</span>
            <textarea 
                className="input-card__box" 
                rows={6} 
                value={draft}
                onChange={(e) => onDraftChange(e.target.value)}
                placeholder="Enter the message you want to rewrite"/>
        </div>
    </div>;
};

export default InputCard;
