import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, EventType, AccountInfo } from "@azure/msal-browser";
import axios from 'axios';
import { BACKEND_URI } from './api/BACKEND_URI';

import "./index.css";

import Layout from "./pages/layout/Layout";
import Chat from "./pages/chat/Chat";

var layout;

layout = <Layout />;

initializeIcons();

interface SessionResponse {
    sessionID: string;
}

window.onload = async () => {
    const sessionIDKey = 'sessionID';
    let sessionID = localStorage.getItem(sessionIDKey);
    
    if (!sessionID) {
        try {
            const response = await axios.get<SessionResponse>(BACKEND_URI+'/createSessionId');
            sessionID = response.data.sessionID;  // Adjust this based on your backend's response structure
            localStorage.setItem(sessionIDKey, sessionID);
            console.log('New session ID fetched and stored:', sessionID);
        } catch (error) {
            console.error('Error fetching session ID from the backend:', error);
        }
    } else {
        console.log('Session ID already exists:', sessionID);
    }

};

const router = createHashRouter([
    {
        path: "/",
        element: layout,
        children: [
            {
                index: true,
                element: <Chat />
            },
            {
                path: "*",
                lazy: () => import("./pages/NoPage")
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
