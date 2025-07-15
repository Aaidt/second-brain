import { Navigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react';
import { getAccessToken, refreshAccessToken } from "../auth";

export function ProtectedRoute ({ children }: { children: React.JSX.Element }){
    const [token, setToken] = useState(getAccessToken()) 
    const [loading, setLoading] = useState<boolean>(!token);
    console.log(token)

    useEffect(() => {
        setLoading(true)
        if (!token) {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
                refreshAccessToken(BACKEND_URL)
                    .then(newToken => {
                        setToken(newToken)
                        setLoading(false)
                    })
                    .catch(() => {
                        setToken(null)
                        setLoading(false)
                    })
        } else {
            setLoading(false);
        }

    }, [token])

    if(loading){
        toast.info("Loading")
        return null
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
