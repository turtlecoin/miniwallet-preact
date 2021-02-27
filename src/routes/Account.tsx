/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { h } from "preact";
import { useMemo, useState } from "preact/hooks";
import { Loader } from "../components/Loader";
import { API_URI } from "../constants/config";
import { User } from "../types";
import Backup from "../components/Backup";
import { Router, Route, Link, route } from "preact-router";

interface TOTPRes {
    secret: string;
    qr: string;
}

export function Account(props: {
    matches?: Record<string, any>;
    setUser: (user: User | null) => void;
    user: User | null;
    path: string;
}): h.JSX.Element {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [qrData, setQrData] = useState<TOTPRes | null>(null);
    const [token, setToken] = useState("");

    const [disenrollPw, setDisenrollPw] = useState("");
    const [disenrollToken, setDisenrollToken] = useState("");

    const [disabling2FA, setDisabling2FA] = useState(false);

    const { page } = props.matches as { page?: string };

    useMemo(() => {
        setDisabling2FA(false);
    }, [page]);

    if (page === ":page") {
        route("/account/password", true);
        return <span />;
    }

    const changePassword = async (): Promise<void> => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const res = await fetch(`${API_URI}/account/password`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                oldPassword,
                newPassword,
            }),
        });
        if (res.status === 200) {
            alert("Your password has been changed.");
            props.setUser(await res.json());
        } else {
            alert("There was a problem when changing your password.");
        }
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
            alert("Successfully enrolled in 2FA!");
            const data = await res.json();
            console.log(data);
            props.setUser(data);
        } else {
            alert("Something went wrong, check your code and try again.");
        }
    };

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
            console.log(data);
            props.setUser(data);
        } else {
            alert("Something went wrong, check your code and try again.");
        }
    };

    if (!props.user) {
        return <Loader />;
    }

    return (
        <div class="card container">
            <div>
                <ul class="tabs">
                    <li>
                        <Link
                            href={"/account/password"}
                            class={`${
                                page === "" || page === "password"
                                    ? "active"
                                    : ""
                            }`}
                        >
                            Password
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={"/account/2fa"}
                            class={`${page === "2fa" ? "active" : ""}`}
                        >
                            2FA
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={"/account/backup"}
                            class={`${page === "backup" ? "active" : ""}`}
                        >
                            Backup
                        </Link>
                    </li>
                    <li>
                        <Link>Log Out</Link>
                    </li>
                </ul>

                {(page === "" || page === "password") && (
                    <form
                        onSubmit={(event): void => {
                            event.preventDefault();
                            changePassword();
                        }}
                    >
                        <h5>Change Your Password</h5>
                        <label>Old Password:</label>
                        <input
                            autoComplete={"current-password"}
                            value={oldPassword}
                            onInput={(event: any): void => {
                                setOldPassword(event.target.value);
                            }}
                            type="password"
                            placeholder="hunter2"
                        />

                        <input autoComplete="username" class="hidden" />
                        <div class="row">
                            <div class="six columns">
                                <label>New Password:</label>
                                <input
                                    autoComplete={"new-password"}
                                    value={newPassword}
                                    onInput={(event: any): void => {
                                        setNewPassword(event.target.value);
                                    }}
                                    type="password"
                                    placeholder="hunter42"
                                />
                            </div>
                            <div class="six columns">
                                <label>Confirm Password:</label>
                                <input
                                    autoComplete={"new-password"}
                                    value={confirmPassword}
                                    onInput={(event: any): void => {
                                        setConfirmPassword(event.target.value);
                                    }}
                                    type="password"
                                    placeholder="hunter42"
                                />
                            </div>
                        </div>
                        <button type="submit" class="button-primary">
                            Change Password
                        </button>
                    </form>
                )}
                {page === "2fa" && (
                    <div>
                        {props.user?.twoFactor && (
                            <div>
                                <h5>✓ 2FA Enabled</h5>
                                {disabling2FA && (
                                    <form
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            disenroll2FAKey();
                                        }}
                                    >
                                        <label>Password</label>
                                        <input
                                            value={disenrollPw}
                                            onInput={(event: any) => {
                                                setDisenrollPw(
                                                    event.target.value
                                                );
                                            }}
                                            type="password"
                                            autoComplete="current-password"
                                        />
                                        <label>2FA Code</label>
                                        <input
                                            value={disenrollToken}
                                            onInput={(event: any) => {
                                                setDisenrollToken(
                                                    event.target.value
                                                );
                                            }}
                                            type="number"
                                        />
                                        <button
                                            type="submit"
                                            class="button-primary"
                                        >
                                            Disable 2FA
                                        </button>
                                    </form>
                                )}
                                {!disabling2FA && (
                                    <button
                                        class="button-primary"
                                        onClick={() => setDisabling2FA(true)}
                                    >
                                        Click to Disable
                                    </button>
                                )}
                            </div>
                        )}
                        {!props.user?.twoFactor && (
                            <div>
                                <h5>Enable 2FA</h5>
                                {!qrData && (
                                    <button
                                        class="button-primary"
                                        onClick={get2FAKey}
                                    >
                                        Get Code
                                    </button>
                                )}
                                {qrData && (
                                    <div>
                                        <p>
                                            Scan this QR code with your
                                            authenticator app or enter the
                                            secret below, and submit the code.
                                        </p>
                                        <img
                                            src={`data:image/png;base64, ${qrData.qr}`}
                                        />
                                        <p class="monospace">{qrData.secret}</p>
                                        <label>Enter Code:</label>
                                        <form
                                            onSubmit={(event) => {
                                                event.preventDefault();
                                                enroll2FAKey();
                                            }}
                                        >
                                            <input
                                                value={token}
                                                type="number"
                                                onInput={(event: any) => {
                                                    setToken(
                                                        event.target.value
                                                    );
                                                }}
                                            />
                                            <button type="submit button-primary">
                                                Enable 2FA
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {page === "backup" && <Backup user={props.user} />}
            </div>
        </div>
    );
}

export default Account;
