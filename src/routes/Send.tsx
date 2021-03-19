/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Fragment, h } from "preact";
import { Link, route } from "preact-router";
import { useState } from "preact/hooks";
import { Loader } from "../components/Loader";
import { API_URI } from "../constants/config";
import { User } from "../types";
import { humanToAtomic } from "../utils/humanToAtomic";
import { prettyPrintAmount } from "../utils/prettyPrintAmount";

export function Send(props: {
    path: string;
    user: User | null;
    balance: { unlocked: number; locked: number };
    setFetched: () => void;
}): h.JSX.Element {
    const [submitting, setSubmitting] = useState(false);
    const [paymentID, setPaymentID] = useState("");
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [totp, setTOTP] = useState("");

    const clearForm = (): void => {
        setPaymentID("");
        setAddress("");
        setAmount("");
        setTOTP("");
    };

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
                    totp,
                    amount: humanToAtomic(amt),
                }),
            });
            if (res.status === 200) {
                props.setFetched();
                clearForm();
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

    if (!props.user) {
        return <Loader />;
    }

    if (!props.user.confirmedRecovery) {
        route("/confirm-recovery");
        return <Loader />;
    }

    return (
        <div class="card container">
            <div>
                <div class="pinched">
                    <h4 class=" has-text-bold">Send TRTL</h4>
                    <h6 class="subtitle">
                        {prettyPrintAmount(props.balance.unlocked)} available
                    </h6>
                </div>
                <div
                    style={{
                        paddingTop: "1rem",
                        borderTop: "2px solid #F5F5F5",
                    }}
                >
                    <div class="pinched">
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
                            <label>
                                <span class="tooltip">
                                    ℹ️
                                    <span class="tooltiptext">
                                        May be required by some exchanges and
                                        services.
                                    </span>
                                </span>{" "}
                                PaymentID:
                            </label>
                            <input
                                type="text"
                                className="input"
                                placeholder="9a932094c16f9379e75cc64eaf4c90ddb82f62a1c108969c04888a28848e330a"
                                value={paymentID}
                                onInput={(event: any): void => {
                                    setPaymentID(event.target.value);
                                }}
                            />
                            {props.user?.twoFactor && (
                                <Fragment>
                                    <label>2FA Code:</label>
                                    <input
                                        value={totp}
                                        onInput={(event: any): void => {
                                            setTOTP(event.target.value);
                                        }}
                                        type="number"
                                        placeholder="123456"
                                    />
                                </Fragment>
                            )}
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
                </div>
            </div>
        </div>
    );
}

export default Send;
