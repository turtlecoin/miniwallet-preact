import { FunctionalComponent, h } from "preact";
import { route } from "preact-router";

const Home: FunctionalComponent = () => {
    return (
        <div class="card container">
            <div class="pinched">
                <h3>Welcome to TRTL Miniwallet</h3>
                <p>
                    Miniwallet is a webwallet for TurtleCoin with a focus on
                    being small and easy to use. You can use it in browser, and
                    we also have native apps for Android and iOS. Manage your
                    TurtleCoin wherever you are, we'll keep your wallet synced
                    for you.
                </p>
                <p>
                    Disclaimer: Miniwallet is a <strong>custodial</strong> web
                    wallet meaning that we retain a copy of your private keys on
                    our server. You are also provided with the private keys so
                    you can sync the wallet in any other wallet application of
                    your choosing. We do the best we can to keep your funds
                    safe, but we take no responsibility and provide no warranty
                    for the safety of or suitabilty of these services. Please
                    ensure you back up your private key in the settings page as
                    you and only you are responsible for the safety of your
                    funds.
                </p>
                <p>
                    For more information about our terms of service, please
                    refer to the miniwallet{" "}
                    <a
                        href="https://github.com/turtlecoin/miniwallet-preact/blob/master/LICENSE"
                        target="__blank"
                        rel="noreferrer"
                    >
                        software license.
                    </a>
                </p>
                <button
                    class="button-ghost"
                    onClick={(): void => {
                        route("/register");
                    }}
                >
                    Sign up
                </button>
                <br />
                <br />
                <a
                    href="https://apps.apple.com/us/app/trtl-wallet/id1555827693"
                    target="__blank"
                    rel="noreferrer"
                >
                    <img
                        style={{ margin: "9px" }}
                        src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
                    />
                </a>
                <a
                    href="https://play.google.com/store/apps/details?id=lol.trtl.miniwallet&hl=en_US&gl=US"
                    target="__blank"
                    rel="noreferrer"
                >
                    <img
                        style={{ display: "inline-block", width: "150px" }}
                        alt="Get it on Google Play"
                        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                    />
                </a>
            </div>
        </div>
    );
};

export default Home;
