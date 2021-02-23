import { Fragment, h } from "preact";
import { Link } from "preact-router/match";
import { User } from "../types";

function Header(props: {
    user: User | null;
    setUser: (user: User | null) => void;
}): h.JSX.Element {
    const logout = async (): Promise<void> => {
        await fetch("http://localhost:5555/logout", {
            method: "POST",
            credentials: "include",
        });
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
