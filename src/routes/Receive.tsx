/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { h } from "preact";
import { useState } from "preact/hooks";
import { Loader } from "../components/Loader";
import { User } from "../types";

export function Receive(props: {
    path: string;
    user: User | null;
}): h.JSX.Element {
    const [copied, setCopied] = useState(false);

    if (!props.user) {
        return <Loader />;
    }

    return (
        <div class="card container">
            <div class="pinched">
                <h4 class=" has-text-bold">Receive TRTL</h4>
                <h6 class="subtitle">My Wallet Details</h6>
            </div>
            <div style={{ borderTop: "2px solid #F5F5F5" }}>
                <div style={{ textAlign: "center" }}>
                    <img
                        style={{ margin: "2rem" }}
                        src={"https://trtl.co.in/api/qr/" + props.user.address}
                    />
                </div>
                <div class="pinched">
                    <pre>
                        <code class="wrap">
                            {props.user?.address}
                            <br />
                            <button
                                class="button-ghost cursor clipboard-icon"
                                onClick={(): void => {
                                    navigator.clipboard.writeText(
                                        props.user!.address
                                    );
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 1000);
                                }}
                            >
                                📋 Copy to Clipboard
                            </button>
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    );
}

export default Receive;
