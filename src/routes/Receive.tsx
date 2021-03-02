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
            <div>
                <ul class="tabs">
                    <li class="heading">Address</li>
                    <li class="wrap monospace">
                        {props.user?.address}{" "}
                        <span
                            class="cursor"
                            onClick={(): void => {
                                navigator.clipboard.writeText(
                                    props.user!.address
                                );
                                setCopied(true);
                                setTimeout(() => setCopied(false), 1000);
                            }}
                        >
                            📋
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Receive;
