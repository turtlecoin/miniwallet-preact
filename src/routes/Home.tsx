/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from "preact";
import { Transaction, User } from "../types";
import {
    numberWithCommas,
    prettyPrintAmount,
} from "../utils/prettyPrintAmount";
import { Loader } from "../components/Loader";

function Home(props: {
    path: string;
    user: User | null;
    setUser: (user: User | null) => void;
    balance: { unlocked: number; locked: number } | null;
    transactions: Transaction[] | null;
    prices: Record<string, number>;
}): h.JSX.Element {
    if (!props.user || props.transactions == null || props.balance == null) {
        return <Loader />;
    }

    const total = props.balance.unlocked + props.balance.locked;

    return (
        <div class="card container">
            {!props.user.twoFactor && (
                <div class="pinched">
                    <p class="alert danger">
                        ⚠ Consider enabling{" "}
                        <a class="has-text-info" href="/account/2fa">
                            2FA
                        </a>{" "}
                        on your account for added security.
                    </p>
                </div>
            )}
            <div class="pinched">
                <div class="balance">
                    <h4 class="has-text-bold">{prettyPrintAmount(total)}</h4>
                    {props.balance.locked > 0 && (
                        <p class="alert info fullwidth">
                            🛈{" "}
                            {prettyPrintAmount(total - props.balance.unlocked)}{" "}
                            locked
                        </p>
                    )}
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
                    <table style={{ width: "100%" }}>
                        <thead>
                            <tr
                                class="tx-table-row"
                                style={{ backgroundColor: "#F5F5F5" }}
                            >
                                <td>Transactions</td>
                                <td />
                            </tr>
                        </thead>
                        <tbody>
                            {props.transactions.map((tx) => (
                                <tr class="tx-table-row" key={tx.hash}>
                                    <td class="monospace">
                                        <a
                                            class="black-link"
                                            href={`https://explorer.turtlecoin.lol/transaction.html?hash=${tx.hash}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {`${tx.hash.slice(
                                                0,
                                                6
                                            )}…${tx.hash.slice(
                                                tx.hash.length - 6,
                                                tx.hash.length
                                            )}`}
                                        </a>
                                    </td>
                                    <td class="has-text-right">
                                        {tx.amount < 0 && (
                                            <span style={{ color: "#831414" }}>
                                                {prettyPrintAmount(tx.amount)}
                                            </span>
                                        )}
                                        {tx.amount > 0 && (
                                            <span style={{ color: "#43b380" }}>
                                                +{prettyPrintAmount(tx.amount)}
                                            </span>
                                        )}
                                        <br />
                                        <span>
                                            {tx.timestamp
                                                ? new Date(
                                                      tx.timestamp * 1000
                                                  ).toLocaleDateString()
                                                : "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

export default Home;
