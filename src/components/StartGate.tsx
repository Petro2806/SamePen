import ThinkingText from "./ThinkingText"
import './StartGate.css'

type StartGateProps = {
    checking: boolean;
    error: string | null;
    onStart: () => void;
};

const StartGate = ({checking, error, onStart}: StartGateProps) => {
    return <div className="start-gate">
        <div className="card start-gate__card">
            <span className="start-gate__title">Ready when Ollama is</span>
            <p className="start-gate__text">
                ReTone rewrites your messages with a model running on your own machine,
                so nothing you write leaves it. Start Ollama, then check the connection.
            </p>
            {error &&
                <span className="start-gate__error">{error}</span>
            }
            <button
                type="button"
                className="start-gate__button"
                onClick={onStart}
                disabled={checking}
                >{checking ? <ThinkingText label="Checking" /> : "Check and start"}</button>
        </div>
    </div>;
};

export default StartGate;
