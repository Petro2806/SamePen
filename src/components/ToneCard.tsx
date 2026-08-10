import React from "react"
import './ToneCard.css'

type ToneCardProps = {
    directness: number;
    onDirectnessChange: (value: number) => void;
    warmth: number;
    onWarmthChange: (value: number) => void;
    loading: boolean;
    onRewrite: () => void;
};

const ToneCard = ({directness, onDirectnessChange, warmth, onWarmthChange, loading, onRewrite} : ToneCardProps) => {
    return <div className="card">
        <div>
            <div className="slider-card__tone">
                <span>Hint gently</span>
                <span className="slider-card__name">
                    Directness <span className="slider-card__value">{directness}</span>
                </span>
                <span>Say it straight</span>
            </div>
            <input 
                type="range" 
                className="slider-card__slider" 
                min={0} 
                max={100} 
                value={directness}
                onChange={(e) => onDirectnessChange(Number(e.target.value))}
            />
        </div>
        
        <div>
            <div className="slider-card__tone">
                <span>Dry & neutral</span>
                <span className="slider-card__name">
                    Warmth <span className="slider-card__value">{warmth}</span>
                </span>
                <span>Warm & friendly</span>
            </div>
            <input 
                type="range" 
                className="slider-card__slider" 
                min={0} 
                max={100} 
                value={warmth}
                onChange={(e) => onWarmthChange(Number(e.target.value))}
            />
        </div>

        <button 
            type="button" 
            className="slider-card__button"
            onClick={onRewrite} 
            disabled={loading}
        >{loading ? "Rewriting.." : "Rewrite in my voice"}</button>
    </div>;
};

export default ToneCard;
