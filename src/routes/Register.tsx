/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from "preact";
import { useState } from "preact/hooks";
import { route } from "preact-router";
import { User } from "../types";

function Register(props: {
    setUser: (user: User | null) => void;
}): h.JSX.Element {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const register = async (): Promise<void> => {
        const res = await fetch("https://api.trtl.co.in/register", {
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
            route("/")
        } else {
            alert(await res.text());
        }
    };

    return (
        <div class="aligner">
            <div class="aligner-item aligner-item--top" />
            <div class="aligner-item">
                <div class="box">
                    <h5 class="centered monospace">welcome to miniwallet</h5>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onInput={(event: any): void => {
                            setUsername(event.target.value);
                        }}
                    />
                    <div class="row">
                        <div class="six columns">
                            <label>Password: </label>
                            <input
                                type="password"
                                value={password}
                                onInput={(event: any): void => {
                                    setPassword(event.target.value);
                                }}
                            />
                        </div>
                        <div class="six columns">
                            <label>Confirm Password: </label>
                            <input
                                type="password"
                                value={confirm}
                                onInput={(event: any): void => {
                                    setConfirm(event.target.value);
                                }}
                            />
                        </div>
                        <div class="buttons right">
                            <button class="button-primary" onClick={register}>
                                Register
                            </button>
                        </div>
                        <div class="buttons">
                            <button
                                class="button-ghost"
                                onClick={(): void => {
                                    route("/login");
                                }}
                            >
                                Sign in instead
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="aligner-item aligner-item--bottom" />
        </div>
    );
}

export default Register;
