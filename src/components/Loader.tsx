import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

// thanks to cli-spinners at https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json
const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function Loader(): h.JSX.Element {
    const [i, setI] = useState(0);
    const [delay, setDelay] = useState(true);
    const iRef = useRef(i);
    useEffect(() => {
        const t1 = setTimeout(() => setDelay(false), 500);
        const t2 = setInterval(() => {
            if (iRef.current < spinner.length - 1) {
                setI(iRef.current + 1);
            } else {
                setI(0);
            }
        }, 120);
        return (): void => {
            clearTimeout(t1);
            clearInterval(t2);
        };
    }, []);

    useEffect(() => {
        iRef.current = i;
    }, [i]);

    if (delay) {
        return <span />;
    }

    return (
        <div className="aligner">
            <div className="aligner-item aligner-item--top" />
            <div className="aligner-item">
                <div className="spinner">{spinner[i]}</div>
            </div>
            <div className="aligner-item aligner-item--bottom" />
        </div>
    );
}
