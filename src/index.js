import React from 'react';
import ReactDOM from 'react-dom/client';
import './resources/style/index.css';
import './resources/style/fonts.css';
import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import TypeTestPage from "./pages/TypeTestPage";
import ErrorPage from "./pages/ErrorPage";
import Config from "./classes/Config";
import {reduxStore} from "./lib/redux";
import {Providers} from "./lib/providers";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <TypeTestPage/>,
            errorElement: <ErrorPage/>,
        },
    ],
    {
        basename: Config.get("routerBasePath")
    });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Providers store={reduxStore}>
            <RouterProvider router={router}/>
        </Providers>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();