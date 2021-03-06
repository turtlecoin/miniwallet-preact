import { h } from "preact";
import {useMemo, useRef, useState} from "preact/hooks";

// thanks to cli-spinners at https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json
const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function Loader(): h.JSX.Element {
    const [i, setI] = useState(0);
    const [delay, setDelay] = useState(true);
    const iRef = useRef(i);
    useMemo(() => {
        const timeout = setTimeout(() => setDelay(false), 500);

        return (): void => {
            clearInterval(timeout);
        };
    }, []);

    useMemo(() => {
        iRef.current = i;
        const timeout = setTimeout(() => {
            if (iRef.current < spinner.length - 1) {
                setI(iRef.current + 1);
            } else {
                setI(0);
            }
        }, 120);

        return (): void => {
            clearInterval(timeout);
        };
    }, [i]);

    if (delay) {
        return <span />;
    }

    return (
        <div class="aligner">
            <div class="aligner-item aligner-item--top" />
            <div class="aligner-item">
                <div class="spinner">{spinner[i]}</div>
            </div>
            <div class="aligner-item aligner-item--bottom" />
        </div>
    );
}
