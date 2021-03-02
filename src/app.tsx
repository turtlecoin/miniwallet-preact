/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionalComponent, h } from "preact";
import { Router, route, Link } from "preact-router";

import Home from "./routes/Home";
import NotFoundPage from "./routes/404";
import Header from "./components/Header";
import { useMemo, useState } from "preact/hooks";
import { User, Transaction } from "./types";
import Receive from "./routes/Receive";
import Send from "./routes/Send";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Account from "./routes/Account";

import { API_URI } from "./constants/config";
import PrivacyPolicy from "./routes/PrivacyPolicy";
import { notify } from "./utils/notify";
import { prettyPrintAmount } from "./utils/prettyPrintAmount";

const App: FunctionalComponent = () => {
    const [user, setUser] = useState<User | null>(null);
    const [balance, setBalance] = useState<{
        locked: number;
        unlocked: number;
    } | null>(null);
    const [transactions, setTransactions] = useState<Transaction[] | null>(
        null
    );
    const [prices, setPrices] = useState<Record<string, number>>({});
    const [syncData, setSyncData] = useState({ wallet: -1, daemon: -1 });

    const [deadSocket, setDeadSocket] = useState(false);

    // increment to fetch wallet and balance
    const [fetched, setFetched] = useState(Date.now());

    // increment to create new socket and set listeners
    const [gotSocket, setGotSocket] = useState(Date.now());

    const reset = (): void => {
        setUser(null);
        setBalance(null);
        setTransactions(null);
    };

    useMemo(() => {
        if (typeof window === "undefined") {
            return;
        }

        // hacky but i don't want to touch the config file
        const socketUrl = `${API_URI.includes("https") ? "wss://" : "ws://"}${
            API_URI.split("//")[1]
        }/socket`;

        const ws = new WebSocket(socketUrl);

        let pingTimeout = setTimeout(() => ws.close(), 10000 + 1000);
        const heartbeat = (): void => {
            clearTimeout(pingTimeout);
            pingTimeout = setTimeout(() => ws.close(), 10000 + 1000);
        };

        ws.onopen = (): void => {
            setDeadSocket(false);
            heartbeat();
        };

        ws.onclose = (): void => {
            setTimeout(() => setDeadSocket(true), 1000);
            if (pingTimeout) {
                clearTimeout(pingTimeout);
            }
            console.warn("Socket closed.");
            setTimeout(() => setGotSocket(Date.now()), 3000);
        };

        ws.onmessage = (message): void => {
            try {
                const msg: { type: string; data: any } = JSON.parse(
                    message.data
                );
                switch (msg.type) {
                    case "transaction":
                        if (msg.data.amount > 0) {
                            notify(
                                `Received ${prettyPrintAmount(msg.data.amount)}`
                            );
                        }
                        setFetched(Date.now());
                        break;
                    case "prices":
                        setPrices(msg.data);
                        break;
                    case "sync":
                        setSyncData(msg.data);
                        return;
                    case "ping":
                        heartbeat();
                        ws.send(JSON.stringify({ type: "pong" }));
                        break;
                    default:
                        console.warn("Unsupported message type", msg.type);
                        break;
                }
            } catch (err) {
                console.warn(err.toString());
            }
        };
    }, [gotSocket]);

    useMemo(() => {
        (async (): Promise<void> => {
            try {
                const res = await fetch(`${API_URI}/whoami`, {
                    credentials: "include",
                    method: "GET",
                });
                if (res.status === 200) {
                    setUser(await res.json());
                } else {
                    route("/login");
                }
            } catch (err) {
                console.warn(err.toString());
            }
        })();
    }, []);

    useMemo(() => {
        (async (): Promise<void> => {
            if (user === null) {
                return;
            }
            const res = await fetch(`${API_URI}/wallet/sync`, {
                credentials: "include",
                method: "GET",
            });

            if (res.status === 200) {
                setSyncData(await res.json());
            }
        })();
    }, [user]);

    useMemo(() => {
        (async (): Promise<void> => {
            if (user === null) {
                return;
            }
            const res = await fetch(`${API_URI}/price`, {
                credentials: "include",
                method: "GET",
            });

            if (res.status === 200) {
                setPrices(await res.json());
            }
        })();
    }, [user]);

    useMemo(() => {
        (async (): Promise<void> => {
            if (user === null) {
                return;
            }
            const res = await fetch(`${API_URI}/wallet/balance`, {
                credentials: "include",
                method: "GET",
            });
            if (res.status === 200) {
                const balance: {
                    unlocked: number;
                    locked: number;
                } = await res.json();
                if (balance.locked > 0) {
                    setTimeout(() => setFetched(Date.now()), 10000);
                }
                setBalance(balance);
            }
        })();
    }, [user, fetched]);

    useMemo(() => {
        if (user === null) {
            return;
        }
        (async (): Promise<void> => {
            const res = await fetch(`${API_URI}/wallet/transactions`, {
                credentials: "include",
                method: "GET",
            });

            if (res.status === 200) {
                setTransactions(await res.json());
            }
        })();
    }, [user, fetched]);

    return (
        <div class="app">
            <div class="content">
                <Header user={user} setUser={setUser} reset={reset} />
                <Router>
                    <Home
                        syncData={syncData}
                        deadSocket={deadSocket}
                        transactions={transactions}
                        setUser={setUser}
                        user={user}
                        balance={balance}
                        prices={prices}
                        path="/"
                    />
                    <Receive user={user} path="/receive" />
                    <Send
                        balance={balance || { unlocked: 0, locked: 0 }}
                        transactions={transactions}
                        setTransactions={setTransactions}
                        path="/send"
                    />
                    <Login setUser={setUser} path="/login" />
                    <Register setUser={setUser} path="/register" />
                    <Account
                        path="/account/:page?"
                        setUser={setUser}
                        user={user}
                        reset={reset}
                    />
                    <PrivacyPolicy path="/privacy-policy" />
                    <NotFoundPage default />
                </Router>
            </div>
            <footer>
                <div class="container footer-container">
                    <div class="pinched">
                        <ul>
                            <li>Copyright 2020 LogicBite LLC</li>
                            <li>
                                <Link href="/privacy-policy">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
