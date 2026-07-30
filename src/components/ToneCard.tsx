import React from "react"
import './ToneCard.css'

const ToneCard = () => {
    return <div className="card">
        <div>
            <div className="slider-card__tone">
                <span>Hint gently</span>
                <span className="slider-card__name">Directness</span>
                <span>Say it straight</span>
            </div>
            <input type="range" className="slider-card__slider" min={0} max={100} defaultValue={50}/>
        </div>
        
        <div>
            <div className="slider-card__tone">
                <span>Dry & neutral</span>
                <span className="slider-card__name">Warmth</span>
                <span>Warm & friendly</span>
            </div>
            <input type="range" className="slider-card__slider" min={0} max={100} defaultValue={40}/>
        </div>

        <button type="button" className="slider-card__button">Rewrite in my voice</button>
    </div>;
};

export default ToneCard;
