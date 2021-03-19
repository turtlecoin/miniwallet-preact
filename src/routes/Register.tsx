/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from "preact";
import { useState } from "preact/hooks";
import { Link, route } from "preact-router";
import { User } from "../types";
import { API_URI } from "../constants/config";

function Register(props: {
    setUser: (user: User | null) => void;
    path: string;
}): h.JSX.Element {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const register = async (): Promise<void> => {
        const res = await fetch(`${API_URI}/register`, {
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
        } else {
            alert(await res.text());
        }
    };

    return (
        <div class="card container no-menu">
            <div class="pinched">
                <div class="box">
                    <h5 class="centered">Welcome to miniwallet</h5>
                    <form
                        onSubmit={(event): void => {
                            event.preventDefault();
                            register();
                        }}
                    >
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
                            <p>
                                By siging up you are agreeing to our{" "}
                                <Link href="/">terms of service.</Link>
                            </p>
                            <div class="buttons right">
                                <button class="button-primary">Register</button>
                            </div>
                            <div class="buttons">
                                <button
                                    type="submit"
                                    class="button-ghost"
                                    onClick={(): void => {
                                        route("/login");
                                    }}
                                >
                                    Sign in instead
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
