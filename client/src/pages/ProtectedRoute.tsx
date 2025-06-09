import { Navigate } from "react-router-dom"

export const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {

    const token = localStorage.getItem("authorization");
    const payload = token ? JSON.parse((atob(token.split('.')[1]))) : undefined
    const expiry = payload.exp

    const isVerified = (token: string) => {
        if (!token) return false;
        const now = Math.floor(Date.now() / 1000);
        return now < expiry
    }

    if (!isVerified) {
        return <Navigate to="/signin" replace />
    }

    return children
}