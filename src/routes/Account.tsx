/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { h } from "preact";
import { Loader } from "../components/Loader";
import { User } from "../types";
import Backup from "../components/Backup";
import { Link, route } from "preact-router";
import { ChangePassword } from "../components/ChangePassword";
import { Disable2FA } from "../components/Disable2FA";
import { Enable2FA } from "../components/Enable2FA";

export function Account(props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    matches?: Record<string, any>;
    setUser: (user: User | null) => void;
    user: User | null;
    path: string;
    reset: () => void;
}): h.JSX.Element {
    const { page } = props.matches as { page?: string };
    if (page?.includes(":page")) {
        route("/account", true);
        return <span />;
    }

    if (!props.user) {
        return <Loader />;
    }

    return (
        <div class="card container">
            <div>
                {page === "" && (
                    <ul class="tabs">
                        <div class="pinched">
                            <h4 class=" has-text-bold">My Account</h4>
                            <h6 class="subtitle">Profile and Settings</h6>
                        </div>
                        <li class="heading">Security</li>
                        <li>
                            <Link href={"/account/password"}>
                                Change Password
                            </Link>
                        </li>
                        <li>
                            <Link href={"/account/2fa"}>
                                {!props.user.twoFactor
                                    ? "Enable 2FA"
                                    : "Disable 2FA"}
                            </Link>
                        </li>
                        <li class="heading">Wallet</li>
                        <li>
                            <Link href={"/account/backup"}>Backup</Link>
                        </li>
                        <li class="heading">Account</li>
                        <li>
                            <Link
                                href="/login"
                                onClick={(): void => {
                                    props.reset();
                                }}
                            >
                                Log Out
                            </Link>
                        </li>
                    </ul>
                )}

                {page === "password" && (
                    <ChangePassword setUser={props.setUser} user={props.user} />
                )}
                {page === "2fa" && (
                    <div>
                        {props.user?.twoFactor && (
                            <Disable2FA setUser={props.setUser} />
                        )}
                        {!props.user?.twoFactor && (
                            <Enable2FA setUser={props.setUser} />
                        )}
                    </div>
                )}
                {page === "backup" && <Backup user={props.user} />}
            </div>
        </div>
    );
}

export default Account;
