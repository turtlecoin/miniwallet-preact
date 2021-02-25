import { Fragment, h } from "preact";
import { Link } from "preact-router/match";
import { User } from "../types";
import { route } from "preact-router";
import { API_URI } from "../constants/config";

function Header(props: {
    user: User | null;
    setUser: (user: User | null) => void;
}): h.JSX.Element {
    const logout = async (): Promise<void> => {
        await fetch(`${API_URI}/logout`, {
            method: "POST",
            credentials: "include",
        });
        route("/login");
        props.setUser(null);
    };

    if (!props.user) {
        return <span />;
    }

    return (
        <header>
            <nav class="">
                <ul class="horizontal gray navbar">
                    <div class="container">
                        <li>
                            <Link href="/" activeClassName="active">
                                Home
                            </Link>
                        </li>
                        {props.user !== null && (
                            <Fragment>
                                <li>
                                    <Link href="/send" activeClassName="active">
                                        Send
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/receive"
                                        activeClassName="active"
                                    >
                                        Receive
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/backup"
                                        activeClassName="active"
                                    >
                                        Backup
                                    </Link>
                                </li>
                                <li>
                                    <Link onClick={logout} href="/">
                                        Logout
                                    </Link>
                                </li>
                            </Fragment>
                        )}
                    </div>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
