import { Navigate } from "react-router-dom";
import { toast } from 'react-toastify'

export function ProtectedRoute ({ children }: { children: React.JSX.Element }){
    const token = localStorage.getItem("authorization");

    if (!token) {
        toast.error("Login first!!!");
        console.log("No JWT token found");
        return <Navigate to="/signin" />;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp;

    const now = Math.floor(Date.now() / 1000);
    const isExpired = now > expiry;

    if (isExpired) {
        toast.error("Session expired! Please log in again.");
        return <Navigate to="/signin" />;
    }

    return children;
};
