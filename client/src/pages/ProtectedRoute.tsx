import { Navigate } from "react-router-dom"

export const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
    const token = localStorage.getItem("authorization");

    if (!token) {
        return <Navigate to="/signin" replace />
    }

    return children 
}