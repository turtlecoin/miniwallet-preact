/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from "preact";
import { Transaction, User } from "../types";
import { prettyPrintAmount } from "../utils/prettyPrintAmount";

function Home(props: {
    user: User | null;
    setUser: (user: User | null) => void;
    balance: { total: number; available: number };
    transactions: Transaction[];
}): h.JSX.Element {
    if (!props.user) {
        return <span />
    }

    return (
        <div class="card container">
            <label>@{props.user.username}</label>
            <div class="balance">
                <h4>{prettyPrintAmount(props.balance.total)}</h4>
                {props.balance.available < props.balance.total && (
                    <p class="alert--info">
                        {prettyPrintAmount(
                            props.balance.total - props.balance.available
                        )}{" "}
                        on hold
                    </p>
                )
            }
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            {/* <td>Time</td> */}
                            <td>Hash</td>
                            <td>Amount</td>
                        </tr>
                    </thead>
                    <tbody>
                        {props.transactions.map((tx) => (
                            <tr key={tx.hash}>
                                {/* <td>{new Date(tx.timestamp * 1000).toLocaleString()}</td> */}
                                <td>
                                    {tx.hash.slice(
                                        tx.hash.length - 6,
                                        tx.hash.length
                                    )}
                                </td>
                                <td class="is-right-justified">
                                    {prettyPrintAmount(tx.amount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Home;
