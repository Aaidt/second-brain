import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const token = localStorage.getItem("authorization");

  if (!token) {
    alert("Login first!!!");
    console.log("No JWT token found");
    return <Navigate to="/signin" />;
  }

  const payload = JSON.parse(atob(token.split(".")[1]));
  const expiry = payload.exp;

  const now = Math.floor(Date.now() / 1000);
  const isExpired = now > expiry;

  if (isExpired) {
    alert("Session expired! Please log in again.");
    return <Navigate to="/signin" />;
  }

  return children;
};
