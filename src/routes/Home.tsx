/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from "preact";
import { Transaction, User } from "../types";
import { prettyPrintAmount } from "../utils/prettyPrintAmount";

function Home(props: {
    user: User | null;
    setUser: (user: User | null) => void;
    balance: { unlocked: number; locked: number };
    transactions: Transaction[];
}): h.JSX.Element {
    const total = props.balance.unlocked + props.balance.locked;

    if (!props.user) {
        return <span />;
    }

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
                                <td>Block Height</td>
                                <td>Time</td>
                                <td>Hash</td>
                                <td>Amount</td>
                            </tr>
                        </thead>
                        <tbody>
                            {props.transactions.map((tx) => (
                                <tr key={tx.hash}>
                                    <td>{tx.blockHeight}</td>
                                    <td>
                                        {new Date(
                                            tx.timestamp * 1000
                                        ).toLocaleString()}
                                    </td>
                                    <td>
                                        <a
                                            class="monospace"
                                            href={`https://explorer.turtlecoin.lol/transaction.html?hash=${tx.hash}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {tx.hash.slice(
                                                tx.hash.length - 12,
                                                tx.hash.length
                                            )}
                                        </a>
                                    </td>
                                    <td class="is-right-justified">
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
