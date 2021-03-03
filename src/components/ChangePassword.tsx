/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { API_URI } from "../constants/config";
import { User } from "../types";

export function ChangePassword(props: {
    setUser: (user: User) => void;
    user: User | null;
}): h.JSX.Element {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [totp, setTOTP] = useState("");

    const clearForm = (): void => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTOTP("");
    };

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
                totp,
            }),
        });
        if (res.status === 200) {
            alert("Your password has been changed.");
            props.setUser(await res.json());
            clearForm();
        } else {
            alert("There was a problem when changing your password.");
        }
    };

    return (
        <form
            onSubmit={(event): void => {
                event.preventDefault();
                changePassword();
            }}
            class="pinched"
        >
            <h5>
                <span
                    class="icon cursor"
                    onClick={(): void => {
                        route("/account");
                    }}
                >
                    ⬅️
                </span>{" "}
                Change Your Password
            </h5>
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
            {props.user?.twoFactor && (
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
                Change Password
            </button>
        </form>
    );
}
