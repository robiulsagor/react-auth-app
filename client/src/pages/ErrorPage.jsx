import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="h-screen flex items-center justify-center flex-col">
            <h1 className="text-6xl font-bold mb-5">Oops!</h1>
            <p className="text-3xl  mb-5">Sorry, an unexpected error has occurred.</p>
            <p className="text-2xl font-light">
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}