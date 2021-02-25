/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { API_URI } from "../constants/config";
import { User } from "../types";

function Login(props: { setUser: (user: User | null) => void }): h.JSX.Element {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = async (): Promise<void> => {
        const res = await fetch(`${API_URI}/auth`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });
        if (res.status === 200) {
            props.setUser(await res.json());
            route("/");
        } else if (res.status === 401) {
            alert("Invalid login credentials.");
        } else {
            alert(await res.text());
        }
    };

    return (
        <div class="aligner">
            <div class="aligner-item aligner-item--top" />
            <div class="card aligner-item">
                <div class="box container">
                    <h5 class="centered">Welcome to miniwallet</h5>
                    <form onSubmit={(event): void => {
                        event.preventDefault();
                        login();
                    }}>
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
                        <div class="buttons right">
                            <button type="submit" className="button-primary">
                                Log In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="aligner-item aligner-item--bottom" />
        </div>
    );
}

export default Login;
