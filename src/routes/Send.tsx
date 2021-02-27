/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { h } from "preact";
import { useState } from "preact/hooks";
import { Loader } from "../components/Loader";
import { API_URI } from "../constants/config";
import { Transaction } from "../types";
import { humanToAtomic } from "../utils/humanToAtomic";

export function Send(props: {
    path: string;
    transactions: Transaction[] | null;
    setTransactions: (txs: Transaction[]) => void;
}): h.JSX.Element {
    const [submitting, setSubmitting] = useState(false);
    const [paymentID, setPaymentID] = useState("");
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");

    if (props.transactions == null) {
        return <Loader />;
    }

    const submitSend = async (): Promise<void> => {
        setSubmitting(true);
        try {
            const amt = Number.parseInt(amount, 10);
            const res = await fetch(`${API_URI}/wallet/send`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    paymentID,
                    address,
                    amount: humanToAtomic(amt),
                }),
            });
            if (res.status === 200) {
                if (props.transactions !== null) {
                    const copy = [...props.transactions];
                    copy.unshift(await res.json());
                    props.setTransactions(copy);
                    alert("Sent transaction!");
                }
            } else {
                const msg = await res.text();

                if (msg) {
                    alert(msg);
                } else {
                    alert("Something went wrong.");
                }
            }
        } catch (err) {
            alert(err.toString());
        }
        setSubmitting(false);
    };

    return (
        <div class="card container">
            <label>Amount:</label>
            <form
                onSubmit={(event): void => {
                    event.preventDefault();
                    submitSend();
                }}
            >
                <input
                    type="number"
                    value={amount}
                    onInput={(event: any): void => {
                        setAmount(event.target.value);
                    }}
                    placeholder="0.00"
                />
                <label>Address:</label>
                <input
                    type="text"
                    className="input"
                    placeholder="TRTL…3Xf"
                    value={address}
                    onInput={(event: any): void => {
                        setAddress(event.target.value);
                    }}
                />
                <label>PaymentID:</label>
                <input
                    type="text"
                    className="input"
                    placeholder="Optional"
                    value={paymentID}
                    onInput={(event: any): void => {
                        setPaymentID(event.target.value);
                    }}
                />
                <div class="buttons right">
                    <button
                        type="submit"
                        class="button-primary"
                        disabled={submitting}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Send;
