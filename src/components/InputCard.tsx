import React from "react"
import './InputCard.css'

const InputCard = () => {
    return <form className="card">
        <div>
            <span>Replying to (optional)</span>
            <textarea rows={4} placeholder="Enter the message you are replying to"/>
        </div>
        <div>
            <span>Your draft</span>
            <textarea rows={6} placeholder="Enter the message you want to rewrite"/>
        </div>
    </form>;
};

export default InputCard;
