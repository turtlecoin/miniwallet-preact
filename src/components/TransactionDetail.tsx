import {h} from "preact";
import {Transaction} from "../types";
import {numberWithCommas, prettyPrintAmount} from "../utils/prettyPrintAmount";
import {useState} from "preact/hooks";

export function TransactionDetail(props: { tx: Transaction }): h.JSX.Element {

    const [showDetails, setShowDetails] = useState(false);
    return (
        <div className="tx-table">
            <table className="table card-table text-nowrap table-vcenter">
                <thead>
                <tr>
                    <th className="monospace" style={{fontWeight: "normal"}}
                        width="70%">{props.tx.hash.slice(
                        0,
                        12
                    )}…{props.tx.hash.slice(
                        props.tx.hash.length - 12,
                        props.tx.hash.length
                    )}
                    </th>
                    <th style={{
                        textAlign: "right",
                        width: "25%",
                        fontWeight: "normal",
                        padding: "1rem 0"
                    }}>
                        <div
                            className={(props.tx.amount < 0) ? "tx-out" : "tx-in"}>
                            {prettyPrintAmount(props.tx.amount)}
                        </div>
                        <div className="tx-date">
                            {props.tx.timestamp
                                ? new Date(
                                    props.tx.timestamp * 1000
                                ).toLocaleDateString()
                                : "Pending"}
                        </div>
                    </th>
                    <th width="5%" style={{padding: "1rem 0"}}>
                        <a className="show-tx-details"
                           data-showing={showDetails}
                           onClick={((): void => !showDetails ? setShowDetails(true) : setShowDetails(false))}>
                            {(!showDetails ? "⌄" : "⌃")}
                        </a>
                    </th>
                </tr>
                </thead>
                {
                    showDetails &&
                    <tbody className="tx-body">
                    <tr>
                      <td>Block Height</td>
                      <td colSpan={2}
                          style={{textAlign: "right"}}>{numberWithCommas(props.tx.blockHeight)}</td>
                    </tr>
                    <tr>
                      <td>Fee</td>
                      <td colSpan={2} style={{textAlign: "right"}}
                          className="tx-fee">{prettyPrintAmount(props.tx.fee)}</td>
                    </tr>
                    <tr>
                      <td>Unlock Time</td>
                      <td colSpan={2}
                          style={{textAlign: "right"}}>{props.tx.unlockTime}</td>
                    </tr>
                    <tr>
                      <td>Payment ID</td>
                      <td colSpan={2}
                          style={{textAlign: "right"}}>{props.tx.paymentID}</td>
                    </tr>
                    </tbody>
                }
            </table>
        </div>
    )
}
