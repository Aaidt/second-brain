import { Navigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { getAccessToken, refreshAccessToken } from "../auth";

export function ProtectedRoute ({ children }: { children: React.JSX.Element }){
    let token = getAccessToken();

    if (!token) {
        // Try to refresh
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        try {
            refreshAccessToken(BACKEND_URL).then(newToken => {
                token = newToken;
            });
        } catch {
            token = null;
        }
    }

    if (!token) {
        toast.error("Login first!!!");
        console.log("No JWT token found");
        return <Navigate to="/signin" />;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiry = payload.exp;
        const now = Math.floor(Date.now() / 1000);
        const isExpired = now > expiry;
        if (isExpired) {
            toast.error("Session expired! Please log in again.");
            return <Navigate to="/signin" />;
        }
    } catch {
        toast.error("Invalid token. Please log in again.");
        return <Navigate to="/signin" />;
    }

    return children;
};
