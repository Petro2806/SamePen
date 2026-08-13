import { useState, useEffect } from "react"

const DOTS = ["", ".", "..", "..."];
const STEP_MS = 400;

type ThinkingTextProps = {
    label: string;
};

const ThinkingText = ({label}: ThinkingTextProps) => {
    const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (reducedMotion) {
            return;
        }

        const timer = window.setInterval(() => setStep(prev => (prev + 1) % DOTS.length), STEP_MS);
        return () => window.clearInterval(timer);
    }, [reducedMotion]);

    return <>{label}{reducedMotion ? "…" : DOTS[step]}</>;
};

export default ThinkingText;
