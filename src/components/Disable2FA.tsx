/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { API_URI } from "../constants/config";
import { User } from "../types";

export function Disable2FA(props: {
    setUser: (user: User) => void;
}): h.JSX.Element {
    const [disenrollPw, setDisenrollPw] = useState("");
    const [disenrollToken, setDisenrollToken] = useState("");

    const [disabling2FA, setDisabling2FA] = useState(false);

    const disenroll2FAKey = async (): Promise<void> => {
        const res = await fetch(`${API_URI}/account/totp/disenroll`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: disenrollToken,
                password: disenrollPw,
            }),
        });
        if (res.status === 200) {
            alert("Successfully removed 2FA!");
            const data = await res.json();
            props.setUser(data);
        } else {
            alert("Something went wrong, check your code and try again.");
        }
    };

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
                Disable 2FA
            </h5>
            {disabling2FA && (
                <form
                    onSubmit={(event): void => {
                        event.preventDefault();
                        disenroll2FAKey();
                    }}
                >
                    <label>Password</label>
                    <input
                        value={disenrollPw}
                        onInput={(event: any): void => {
                            setDisenrollPw(event.target.value);
                        }}
                        type="password"
                        autoComplete="current-password"
                    />
                    <label>2FA Code</label>
                    <input
                        value={disenrollToken}
                        onInput={(event: any): void => {
                            setDisenrollToken(event.target.value);
                        }}
                        type="number"
                    />
                    <button type="submit" class="button-primary">
                        Disable 2FA
                    </button>
                </form>
            )}
            {!disabling2FA && (
                <button
                    class="button-primary"
                    onClick={(): void => setDisabling2FA(true)}
                >
                    Click to Disable
                </button>
            )}
        </div>
    );
}
