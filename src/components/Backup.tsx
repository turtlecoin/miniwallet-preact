/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { h } from "preact";
import { useState } from "preact/hooks";
import { API_URI } from "../constants/config";
import { User } from "../types";

function Backup(props: { user: User | null }): h.JSX.Element {
    const [password, setPassword] = useState("");
    const [secrets, setSecrets] = useState({
        spendKey: "",
        viewKey: "",
    });

    const getSecrets = async (): Promise<void> => {
        const res = await fetch(`${API_URI}/wallet/secrets`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password,
            }),
        });
        if (res.status === 200) {
            setSecrets(await res.json());
        } else {
            alert("Couldn't get secrets, check your password.");
        }
    };

    if (!props.user) {
        return <span />;
    }

    return (
        <div>
            <h5>Backup Your Keys</h5>
            {secrets.spendKey === "" && (
                <div>
                    <form
                        onSubmit={(event): void => {
                            event.preventDefault();
                            getSecrets();
                        }}
                    >
                        <label>Enter Password to Unlock Keys:</label>
                        <input autoComplete="username" class="hidden" />
                        <input
                            autoComplete={"current-password"}
                            value={password}
                            onInput={(event: any): void => {
                                setPassword(event.target.value);
                            }}
                            type="password"
                            placeholder="hunter2"
                        />
                        <button type="submit" class="button-primary">
                            Show Secrets
                        </button>
                    </form>
                </div>
            )}
            {secrets.spendKey !== "" && (
                <div>
                    <p class="alert danger">
                        ⚠ Do not share these keys with anybody, you will lose
                        your funds.
                    </p>
                    <pre>
                        <label>Private Spend Key:</label>
                        <p>{secrets.spendKey}</p>
                        <label>Private View Key:</label>
                        <p>{secrets.viewKey}</p>
                    </pre>
                </div>
            )}
        </div>
    );
}

export default Backup;
