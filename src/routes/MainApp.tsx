/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from "preact";
import { Transaction, User } from "../types";
import {
    numberWithCommas,
    prettyPrintAmount,
} from "../utils/prettyPrintAmount";
import { Loader } from "../components/Loader";
import { TransactionDetail } from "../components/TransactionDetail";
import { route } from "preact-router";

function MainApp(props: {
    path: string;
    user: User | null;
    setUser: (user: User | null) => void;
    balance: { unlocked: number; locked: number } | null;
    transactions: Transaction[] | null;
    prices: Record<string, number>;
    deadSocket: boolean;
    syncData: { wallet: number; daemon: number };
}): h.JSX.Element {
    if (!props.user || props.transactions == null || props.balance == null) {
        return <Loader />;
    }

    if (!props.user.confirmedRecovery) {
        route("/confirm-recovery");
        return <Loader />;
    }

    const total = props.balance.unlocked + props.balance.locked;

    return (
        <div class="card container">
            <div class="right-tags">
                {props.deadSocket && (
                    <p class="alert danger">🔴 Disconnected</p>
                )}
                {props.syncData.daemon - props.syncData.wallet > 2 && (
                    <p class="alert warning">🟡 Synchronizing</p>
                )}
                {props.balance.locked > 0 && (
                    <p class="alert info">
                        🔒 {prettyPrintAmount(total - props.balance.unlocked)}{" "}
                        locked
                    </p>
                )}
            </div>
            <div class="pinched">
                <div class="balance">
                    <h4 class="has-text-bold">
                        {prettyPrintAmount(total, true)}
                    </h4>
                </div>
                <h6 class="fiat-balance">
                    {numberWithCommas(
                        Number(
                            (
                                props.prices["turtlecoin"] *
                                (total / 100)
                            ).toFixed(2)
                        )
                    )}{" "}
                    USD
                </h6>
            </div>
            {props.transactions.length > 0 && (
                <div>
                    <p
                        style={{
                            backgroundColor: "#F5F5F5",
                            padding: "1rem",
                            margin: "0",
                            fontWeight: "bold",
                        }}
                    >
                        Transactions
                    </p>
                    <div class="tx-table-wrapper">
                        {props.transactions.map((tx) => (
                            <TransactionDetail
                                syncData={props.syncData}
                                tx={tx}
                            />
                        ))}
                    </div>
                </div>
            )}
            {props.transactions.length === 0 && (
                <div class="pinched">
                    <p>You don't have any transactions yet!</p>
                </div>
            )}
        </div>
    );
}

export default MainApp;
