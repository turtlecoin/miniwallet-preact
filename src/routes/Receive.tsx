/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { h } from "preact";
import { useState } from "preact/hooks";
import { User } from "../types";

export function Receive(props: { user: User | null }): h.JSX.Element {
    const [copied, setCopied] = useState(false);

    return (
        <div class="card container">
            <label>Address:</label>
            <pre>
                <code>{props.user?.address}</code>
            </pre>
            <button class="button-primary"
                onClick={(): void => {
                    navigator.clipboard.writeText(props.user!.address);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1000);
                }}
            >
                {copied ? "Copied!" : "Copy Address"}
            </button>
        </div>
    );
}

export default Receive;
