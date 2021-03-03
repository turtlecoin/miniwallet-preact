/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { API_URI } from "../constants/config";
import { User } from "../types";

function Backup(props: { user: User | null }): h.JSX.Element {
    const [password, setPassword] = useState("");
    const [totp, setTOTP] = useState("");
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
                totp,
            }),
        });
        if (res.status === 200) {
            setSecrets(await res.json());
        } else {
            alert(await res.text());
        }
    };

    if (!props.user) {
        return <span />;
    }

    return (
        <div class="pinched">
            <h5>
                <span
                    class="icon cursor"
                    onClick={(): void => {
                        route("/account");
                    }}
                >
                    ⬅️
                </span>{" "}
                Backup Your Keys
            </h5>
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
                        {props.user.twoFactor && (
                            <Fragment>
                                <label>2FA Code:</label>
                                <input
                                    value={totp}
                                    onInput={(event: any): void => {
                                        setTOTP(event.target.value);
                                    }}
                                    type="number"
                                    placeholder="123456"
                                />
                            </Fragment>
                        )}

                        <button type="submit" class="button-primary">
                            Show Secrets
                        </button>
                    </form>
                </div>
            )}
            {secrets.spendKey !== "" && (
                <div>
                    <p class="alert danger">
                        🚫 Do not share these keys with anybody, you will lose
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
