/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { h } from "preact";
import { useMemo, useState } from "preact/hooks";

const PRIVACY_POLICY_URL =
    "https://raw.githubusercontent.com/LogicBite/miniwallet-privacy-policy/master/PrivacyPolicy.md";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PrivacyPolicy({ path }: { path: string }): h.JSX.Element {
    const [privacyPolicyMd, setPrivacyPolicyMd] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [commitHistory, setCommitHistory] = useState([] as any[]);

    useMemo(async () => {
        const policyRes = await fetch(PRIVACY_POLICY_URL);
        setPrivacyPolicyMd(await policyRes.text());

        const commitRes = await fetch(
            "https://api.github.com/repos/LogicBite/miniwallet-privacy-policy/commits/master"
        );

        const topCommit = await commitRes.json();
        const commitHistoryRes = await fetch(
            `https://api.github.com/repos/LogicBite/miniwallet-privacy-policy/commits?per_page=10&sha=${topCommit.sha}`
        );

        setCommitHistory(await commitHistoryRes.json());
    }, []);


    return (
        <div class="card container">
            {privacyPolicyMd.split("\n").map((line, index) => {
                if (line.trim() == "") {
                    return <span key={index} />
                }
                if (line.startsWith("##")) {
                    return <h5 key={index}>{line.replace("##", "").trim()}</h5>
                }
                if (line.startsWith("#")) {
                    return <h3 key={index}>{line.replace("#", "").trim()}</h3>
                }
                return <p key={index}>
                    {line}
                </p>
            })}


            <h5>Update History</h5>
            <ul>
                {commitHistory.map((commit) => (
                    <li>
                        {new Date(
                            commit.commit.author.date
                        ).toLocaleDateString()}: {commit.commit.message}  <a target="_blank" rel="noreferrer" href={commit.html_url}>view diff</a>
                    </li>
                ))}
            </ul>
            <a
                className="help"
                target="_blank" rel="noreferrer"
                href="https://github.com/logicbite/miniwallet-privacy-policy/commits/master"
            >
                complete change history
            </a>
        </div>
    );
}


export default PrivacyPolicy;
