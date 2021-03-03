/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { API_URI } from "../constants/config";
import { User } from "../types";

interface TOTPRes {
    secret: string;
    qr: string;
}

export function Enable2FA(props: {
    setUser: (user: User) => void;
}): h.JSX.Element {
    const [qrData, setQrData] = useState<TOTPRes | null>(null);
    const [token, setToken] = useState("");

    const clearForm = (): void => {
        setToken("");
    };

    const get2FAKey = async (): Promise<void> => {
        const res = await fetch(`${API_URI}/account/totp/secret`, {
            method: "GET",
            credentials: "include",
        });
        if (res.status === 200) {
            setQrData(await res.json());
        }
    };

    const enroll2FAKey = async (): Promise<void> => {
        const res = await fetch(`${API_URI}/account/totp/enroll`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
            }),
        });
        if (res.status === 200) {
            const data = await res.json();
            props.setUser(data);
            clearForm();
            alert("Successfully enrolled in 2FA!");
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
                Enable 2FA
            </h5>
            {!qrData && (
                <button class="button-primary" onClick={get2FAKey}>
                    Get Code
                </button>
            )}
            {qrData && (
                <div>
                    <p>
                        Scan this QR code with your authenticator app or enter
                        the secret below, and submit the code.
                    </p>
                    <img src={`data:image/png;base64, ${qrData.qr}`} />
                    <p class="monospace">{qrData.secret}</p>
                    <label>Enter Code:</label>
                    <form
                        onSubmit={(event): void => {
                            event.preventDefault();
                            enroll2FAKey();
                        }}
                    >
                        <input
                            value={token}
                            type="number"
                            onInput={(event: any): void => {
                                setToken(event.target.value);
                            }}
                        />
                        <button type="submit button-primary">Enable 2FA</button>
                    </form>
                </div>
            )}
        </div>
    );
}
