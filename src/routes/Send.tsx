/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { h } from "preact";
import { useState } from "preact/hooks";
import { Transaction } from "../types";
import { humanToAtomic } from "../utils/humanToAtomic";

export function Send(props: {
    transactions: Transaction[];
    setTransactions: (txs: Transaction[]) => void;
}): h.JSX.Element {
    const [submitting, setSubmitting] = useState(false);
    const [paymentID, setPaymentID] = useState("");
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");

    const submitSend = async (): Promise<void> => {
        setSubmitting(true);
        try {
            const amt = Number.parseInt(amount, 10);
            console.log(amt);
            const res = await fetch(`https://api.trtl.co.in/wallet/send`, {
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
                const copy = [...props.transactions];
                copy.unshift(await res.json());
                props.setTransactions(copy);
                alert("Sent transaction!");
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
        <div class="container">
            <label>Amount:</label>
            <input
                type="number"
                value={amount}
                onInput={(event: any): void => {
                    setAmount(event.target.value);
                }}
                placeholder="123"
            />
            <label>Address:</label>
            <input
                type="text"
                className="input"
                placeholder="TRTLv1ExtraTJ2oebAvuQB4TzF2uJEFpnbJCkQ4xr71vcqoS96fHX3kTKfHQwkK2Ee3TUD1NCsprfiZHnDL5mqrGiEJHgNz33Xf"
                value={address}
                onInput={(event: any): void => {
                    setAddress(event.target.value);
                }}
            />
            <label>PaymentID: (Optional)</label>
            <input
                type="text"
                className="input"
                placeholder="f896cce24e8bcbb8e35b351a94d14283924ebff826780e500d1ead2232d7b50a"
                value={paymentID}
                onInput={(event: any): void => {
                    setPaymentID(event.target.value);
                }}
            />
            <div class="buttons right">
                <button
                    class="button-primary"
                    disabled={submitting}
                    onClick={submitSend}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default Send;
