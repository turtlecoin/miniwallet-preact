/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from "preact";
import { Transaction, User } from "../types";
import { prettyPrintAmount } from "../utils/prettyPrintAmount";
import { Loader } from "../components/Loader";

function Home(props: {
    user: User | null;
    setUser: (user: User | null) => void;
    balance: { unlocked: number; locked: number } | null;
    transactions: Transaction[] | null;
}): h.JSX.Element {
    if (!props.user || props.transactions == null || props.balance == null) {
        return <Loader />;
    }

    const total = props.balance.unlocked + props.balance.locked;

    return (
        <div class="card container">
            <label>@{props.user.username}</label>
            <div class="balance">
                <h4>{prettyPrintAmount(total)}</h4>
                {props.balance.unlocked < total && (
                    <p class="alert--info">
                        {prettyPrintAmount(total - props.balance.unlocked)}{" "}
                        locked
                    </p>
                )}
            </div>
            {props.transactions.length > 0 && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <td>Height</td>
                                <td class="desktop-only">Hash</td>
                                <td class="has-text-right">Amount</td>
                            </tr>
                        </thead>
                        <tbody>
                            {props.transactions.map((tx) => (
                                <tr key={tx.hash}>
                                    <td>{tx.blockHeight}</td>
                                    <td class="monospace desktop-only">
                                        <a
                                            href={`https://explorer.turtlecoin.lol/transaction.html?hash=${tx.hash}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {tx.hash}
                                        </a>
                                    </td>
                                    <td class="has-text-right">
                                        {prettyPrintAmount(tx.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {props.transactions.length === 0 && (
                <p>You don't have any transactions yet!</p>
            )}
        </div>
    );
}

export default Home;
