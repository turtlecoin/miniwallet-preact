import { Fragment, h } from "preact";
import { Transaction } from "../types";
import {
    numberWithCommas,
    prettyPrintAmount,
} from "../utils/prettyPrintAmount";
import { useState } from "preact/hooks";

export function TransactionDetail(props: {
    tx: Transaction;
    syncData: { wallet: number; daemon: number };
}): h.JSX.Element {
    const [showDetails, setShowDetails] = useState(false);
    return (
        <Fragment>
            <table className="tx-table table card-table text-nowrap table-vcenter">
                <tbody>
                    <tr>
                        <td
                            className="monospace"
                            style={{ fontWeight: "normal" }}
                        >
                            <button
                                class="button-ghost"
                                onClick={(): void =>
                                    !showDetails
                                        ? setShowDetails(true)
                                        : setShowDetails(false)
                                }
                            >
                                {showDetails ? "➖" : "➕"}
                            </button>{" "}
                            {props.tx.hash.slice(0, 6)}…
                            {props.tx.hash.slice(
                                props.tx.hash.length - 6,
                                props.tx.hash.length
                            )}
                        </td>
                        <td
                            style={{
                                textAlign: "right",
                                fontWeight: "normal",
                            }}
                        >
                            <div
                                className={
                                    props.tx.amount < 0 ? "tx-out" : "tx-in"
                                }
                            >
                                {prettyPrintAmount(props.tx.amount)}
                            </div>
                            <div className="tx-date">
                                {props.tx.timestamp
                                    ? new Date(
                                          props.tx.timestamp * 1000
                                      ).toLocaleDateString()
                                    : "Pending"}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            {showDetails && (
                <div
                    style={{
                        padding: "1rem 2.5%",
                        borderBottom: "1px solid #e1e1e1",
                    }}
                >
                    <h6 style={{ marginBottom: "1rem" }}>
                        Transaction Details
                    </h6>
                    <div>
                        Status{" "}
                        <span style={{ float: "right" }}>
                            {props.tx.timestamp ? "✅ Complete" : "⌚ Pending"}
                        </span>
                    </div>
                    <div>
                        Amount
                        <span style={{ float: "right" }}>
                            {prettyPrintAmount(props.tx.amount)}
                        </span>
                    </div>
                    <div>
                        Miner Fee{" "}
                        <span style={{ float: "right" }}>
                            {prettyPrintAmount(props.tx.fee)}
                        </span>
                    </div>
                    <div>
                        Block Height{" "}
                        <span style={{ float: "right" }}>
                            {numberWithCommas(props.tx.blockHeight)}
                        </span>
                    </div>
                    <div>
                        Confirmations{" "}
                        <span style={{ float: "right" }}>
                            {numberWithCommas(
                                props.syncData.daemon - props.tx.blockHeight - 1
                            )}
                        </span>
                    </div>
                    {props.tx.unlockTime > 0 && (
                        <div>Unlock Time: {props.tx.unlockTime}</div>
                    )}
                    {props.tx.paymentID !== "" && (
                        <div>
                            Payment ID{" "}
                            <span
                                style={{
                                    float: "right",
                                    textOverflow: "ellipses",
                                }}
                            >
                                {props.tx.paymentID}
                            </span>
                        </div>
                    )}
                    <div style={{ paddingTop: "1rem" }}>
                        <a
                            target="__blank"
                            rel="noreferrer"
                            href={`https://explorer.turtlecoin.lol/transaction.html?hash=${props.tx.hash}`}
                        >
                            View on Block Explorer
                        </a>
                    </div>
                </div>
            )}
        </Fragment>
    );
}
