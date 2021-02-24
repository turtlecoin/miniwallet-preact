/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { h } from "preact";
import { useState } from "preact/hooks";
import { API_URI } from "../constants/config";
import { User } from "../types";

interface Keys {
    spendKey: string;
    viewKey: string;
}

export function Backup(props: { user: User | null }): h.JSX.Element {
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
        <div class="card container">
            <h2>Backup</h2>
            {secrets.spendKey === "" && (
                <div>
                    <label>Enter Password:</label>
                    <input
                        value={password}
                        onInput={(event: any): void => {
                            setPassword(event.target.value);
                        }}
                        type="password"
                        placeholder="hunter2"
                    />
                    <button type="button-primary" onClick={getSecrets}>
                        Show Secrets
                    </button>
                </div>
            )}
            {secrets.spendKey !== "" && (
                <div>
                    <pre>
                        <label>Public Address:</label>
                        <p>{props.user.address}</p>
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
