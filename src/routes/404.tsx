import { FunctionalComponent, h } from "preact";
import { route } from "preact-router";

const Notfound: FunctionalComponent = () => {
    return (
        <div class="container">
            <h1>Error 404</h1>
            <p>That page doesn&apos;t exist.</p>
            <button
                class="button-ghost"
                onClick={(): void => {
                    route("/");
                }}
            >
                Go back home
            </button>
        </div>
    );
};

export default Notfound;
