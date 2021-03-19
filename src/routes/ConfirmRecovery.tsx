/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from "preact";
import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import { Loader } from "../components/Loader";
import { API_URI } from "../constants/config";
import { User } from "../types";

function ConfirmRecovery(props: {
    user: User | null;
    path?: string;
    setUser: (user: User | null) => void;
}): h.JSX.Element {
    const [page, setPage] = useState("disclaimer");
    const [recoveryData, setRecoveryData] = useState({ recovery: "" });

    const [first, setFirst] = useState("");
    const [seventh, setSeventh] = useState("");
    const [thirteenth, setThirteenth] = useState("");
    const [twentyFirst, setTwentyFirst] = useState("");

    useEffect(() => {
        (async (): Promise<void> => {
            if (props.user === null) {
                return;
            }
            const res = await fetch(`${API_URI}/account/recovery`, {
                credentials: "include",
                method: "POST",
            });

            if (res.status === 200) {
                setRecoveryData(await res.json());
            }
        })();
    }, [props.user]);

    if (page === "disclaimer") {
        return (
            <div class="card container">
                <div class="pinched">
                    <h2>Disclaimer</h2>
                    <p>
                        ⚠️ This is a custodial webwallet, meaning we keep a copy
                        of your private keys on our server.
                    </p>
                    <p>
                        ⚠️ We do the best we can to keep your funds safe, but we
                        offer no warranty for this program to the extent
                        permitted by applicable law.
                    </p>
                    <p>
                        ⚠️ Only you are responsible for the funds you choose to
                        store on this platform.
                    </p>
                    <div class="buttons right">
                        <button
                            class="button-primary"
                            onClick={(): void => setPage("secure")}
                        >
                            I agree
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    if (page === "secure") {
        return (
            <div class="card container">
                <div class="pinched">
                    <h2>Secure</h2>
                    <p>
                        ⚠️ This passphrase is the only method of recovering your
                        account if you lose access.
                    </p>
                    <p>
                        ⚠️ It is extremely important that you back it up, or you
                        may lose access to your funds.
                    </p>
                    <h4>
                        Passphrase{" "}
                        <span
                            onClick={(): void => {
                                navigator.clipboard.writeText(
                                    recoveryData.recovery
                                );
                            }}
                        >
                            📋
                        </span>
                    </h4>
                    <pre
                        style={{
                            width: "100%",
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                        }}
                    >
                        {recoveryData.recovery}
                    </pre>

                    <div class="buttons right">
                        <button
                            class="button-primary"
                            onClick={(): void => setPage("verify")}
                        >
                            I have saved my passphrase
                        </button>
                    </div>
                    <div class="buttons">
                        <button
                            className="button-ghost"
                            onClick={(): void => setPage("disclaimer")}
                        >
                            Go back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (page === "verify") {
        return (
            <div class="card container">
                <div class="pinched">
                    <h2>Verify</h2>
                    <p>
                        Please verify you have saved your passphrase by
                        inputting the correct words.
                    </p>
                    <label>1st word</label>
                    <input
                        value={first}
                        onInput={(event: any): void => {
                            setFirst(event.target.value);
                        }}
                        type="text"
                    />
                    <label>7th word</label>
                    <input
                        type="text"
                        value={seventh}
                        onInput={(event: any) => {
                            setSeventh(event.target.value);
                        }}
                    />
                    <label>13th word</label>
                    <input
                        value={thirteenth}
                        onInput={(event: any) => {
                            setThirteenth(event.target.value);
                        }}
                        type="text"
                    />
                    <label>21st word</label>
                    <input
                        value={twentyFirst}
                        onInput={(event: any) => {
                            setTwentyFirst(event.target.value);
                        }}
                        type="text"
                    />

                    <div class="buttons right">
                        <button
                            class="button-primary"
                            onClick={async (): Promise<void> => {
                                const seedWords = recoveryData.recovery.split(
                                    " "
                                );
                                console.log(seedWords);
                                if (
                                    seedWords[0] !== first ||
                                    seedWords[6] !== seventh ||
                                    seedWords[12] != thirteenth ||
                                    seedWords[20] !== twentyFirst
                                ) {
                                    alert(
                                        "That's not quite right. Check your seed and try again."
                                    );
                                } else {
                                    const res = await fetch(
                                        `${API_URI}/account/recovery`,
                                        {
                                            credentials: "include",
                                            method: "PATCH",
                                        }
                                    );

                                    if (res.status === 200) {
                                        props.setUser(await res.json());
                                        route("/app");
                                    }
                                }
                            }}
                        >
                            Unlock miniwallet
                        </button>
                    </div>
                    <div class="buttons">
                        <button
                            className="button-ghost"
                            onClick={(): void => setPage("secure")}
                        >
                            Go back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <Loader />;
}

export default ConfirmRecovery;
