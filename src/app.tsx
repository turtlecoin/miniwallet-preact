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

    const reset = (): void => {
        setUser(null);
        setBalance(null);
        setTransactions(null);
    };

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
                setBalance(await res.json());
            }
        })();
    }, [user]);

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
    }, [user]);

    return (
        <div class="app">
            <div class="content">
            <Header user={user} setUser={setUser} reset={reset} />
            <Router>
                <Home
                    transactions={transactions}
                    setUser={setUser}
                    user={user}
                    balance={balance}
                    prices={prices}
                    path="/"
                />
                <Receive user={user} path="/receive" />
                <Send
                    transactions={transactions}
                    setTransactions={setTransactions}
                    path="/send"
                />
                <Login setUser={setUser} path="/login" />
                <Register setUser={setUser} path="/register" />
                <Account path="/account/:page?" setUser={setUser} user={user} />
                <PrivacyPolicy path="/privacy-policy" />
                <NotFoundPage default />
            </Router>
            </div>
            <footer>
                <div class="container footer-container">
                    <ul>
                        <li>Copyright 2020 LogicBite LLC</li>
                        <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default App;
