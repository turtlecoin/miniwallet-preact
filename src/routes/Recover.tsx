/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from "preact";
import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import { Loader } from "../components/Loader";
import { API_URI } from "../constants/config";
import { User } from "../types";

function Recover(props: {
    user: User | null;
    path?: string;
    setUser: (user: User | null) => void;
}): h.JSX.Element {
    const [passphrase, setPassphrase] = useState("");
    const [userData, setUserData] = useState<User | null>(null);

    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const submit = async () => {
        const res = await fetch(`${API_URI}/account/restore`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ passphrase, newPassword }),
        });
        if (res.status === 260) {
            setUserData(await res.json());
        } else if (res.status === 200) {
            alert("Your password has been reset. Please log in again.");
            route("/login");
        } else {
            alert(await res.text());
        }
    };

    if (userData === null) {
        return (
            <div class="card container">
                <div class="pinched">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submit();
                        }}
                    >
                        <h3>Recover</h3>
                        <p>
                            Input your recovery passphrase to recover your
                            account.
                        </p>
                        <input
                            value={passphrase}
                            onInput={(event: any) => {
                                setPassphrase(event.target.value);
                            }}
                            type="text"
                        />
                        <div class="buttons right">
                            <button type="submit" class="button-primary">
                                Recover
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
    return (
        <div class="card container">
            <div class="pinched">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                >
                    <h4>Welcome @{userData.username}</h4>
                    <label>Set a new password</label>
                    <input
                        value={newPassword}
                        onInput={(event: any) => {
                            setNewPassword(event.target.value);
                        }}
                        type="password"
                        autoComplete="new-password"
                    />
                    <label>Confirm password:</label>
                    <input
                        value={confirm}
                        onInput={(event: any) => {
                            setConfirm(event.target.value);
                        }}
                        type="password"
                        autoComplete="new-password"
                    />
                    <button type="submit" class="button-primary">
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Recover;
