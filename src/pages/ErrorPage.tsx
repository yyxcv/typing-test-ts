import {useRouteError} from "react-router-dom";
import {useEffect} from "react";

export default function ErrorPage() {
    const error = useRouteError();

    //TODO: write a ts-compatible version of that
    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                {/*<i>{error.statusText || error.message}</i>*/}
            </p>
        </div>
    );
}