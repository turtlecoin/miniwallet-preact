/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";

import Home from "./routes/Home";
import NotFoundPage from "./routes/404";
import Header from "./components/Header";
import { useMemo, useState } from "preact/hooks";
import { User, Transaction } from "./types";
import Receive from "./routes/Receive";
import Send from "./routes/Send";
import Login from "./routes/Login";
import Register from "./routes/Register";

const App: FunctionalComponent = () => {
    const [user, setUser] = useState<User | null>(null);
    const [balance, setBalance] = useState({ total: 0, available: 0 });
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useMemo(() => {
        (async (): Promise<void> => {
            const res = await fetch("https://api.trtl.co.in", {
                credentials: "include",
                method: "GET",
            });

            if (res.status === 200) {
                setUser(await res.json());
            }
        })();
    }, []);

    useMemo(() => {
        (async (): Promise<void> => {
            const res = await fetch("https://api.trtl.co.in/wallet/balance", {
                credentials: "include",
                method: "GET",
            });

            if (res.status === 200) {
                setBalance(await res.json());
            }
        })();
    }, [user]);

    useMemo(() => {
        (async (): Promise<void> => {
            const res = await fetch(
                "https://api.trtl.co.in/wallet/transactions",
                {
                    credentials: "include",
                    method: "GET",
                }
            );

            if (res.status === 200) {
                setTransactions(await res.json());
            }
        })();
    }, [user]);

    return (
        <div class="">
            <Header user={user} setUser={setUser} />
            <Router>
                <Route
                    path="/"
                    component={(): h.JSX.Element => (
                        <Home
                            transactions={transactions}
                            setUser={setUser}
                            user={user}
                            balance={balance}
                        />
                    )}
                />
                <Route
                    path="/receive"
                    component={(): h.JSX.Element => <Receive user={user} />}
                />
                <Route
                    path="/send"
                    component={(): h.JSX.Element => (
                        <Send
                            transactions={transactions}
                            setTransactions={setTransactions}
                        />
                    )}
                />
                <Route
                    path="/login"
                    component={(): h.JSX.Element => <Login setUser={setUser} />}
                />
                <Route
                    path="/register"
                    component={(): h.JSX.Element => (
                        <Register setUser={setUser} />
                    )}
                />
                <NotFoundPage default />
            </Router>
        </div>
    );
};

export default App;
