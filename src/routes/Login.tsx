/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { API_URI } from "../constants/config";
import { User } from "../types";

function Login(props: {
    path: string;
    setUser: (user: User | null) => void;
}): h.JSX.Element {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [collect2FA, setCollect2FA] = useState(false);
    const [totp, setTOTP] = useState("");

    const login = async (): Promise<void> => {
        if (collect2FA && totp === "") {
            alert("2FA code is required.");
            return;
        }
        const res = await fetch(`${API_URI}/auth`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                totp,
            }),
        });
        if (res.status === 200) {
            props.setUser(await res.json());
            route("/");
        } else if (res.status === 202) {
            setCollect2FA(true);
        } else if (res.status === 401) {
            alert("Invalid login credentials.");
        } else if (res.status === 403) {
            alert("That 2FA code isn't valid, check your 2FA again.");
        } else {
            alert(await res.text());
        }
    };

    return (
        <div class="card container no-menu">
            <div class="pinched">
                {collect2FA && (
                    <div class="box">
                        <h6>Welcome @{username}</h6>
                        <form
                            onSubmit={(event): void => {
                                event.preventDefault();
                                login();
                            }}
                        >
                            <label>2FA Code:</label>
                            <input
                                value={totp}
                                onInput={(event: any): void => {
                                    setTOTP(event.target.value);
                                }}
                                type="number"
                            />
                            <div class="buttons right">
                                <button className="button-primary">
                                    Log In
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                {!collect2FA && (
                    <div class="box">
                        <h5 class="centered">Welcome to miniwallet</h5>
                        <form
                            onSubmit={(event): void => {
                                event.preventDefault();
                                login();
                            }}
                        >
                            <label>Username:</label>
                            <input
                                type="text"
                                autoComplete="username"
                                value={username}
                                onInput={(event: any): void => {
                                    setUsername(event.target.value);
                                }}
                            />
                            <label>Password: </label>
                            <input
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onInput={(event: any): void => {
                                    setPassword(event.target.value);
                                }}
                            />
                            <div class="buttons right">
                                <button className="button-primary">
                                    Log In
                                </button>
                            </div>
                            <div class="buttons">
                                <button
                                    class="button-ghost"
                                    href="/register"
                                    onClick={(): void => {
                                        route("/register");
                                    }}
                                >
                                    Create account
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
