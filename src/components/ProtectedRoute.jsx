import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useUser();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user === undefined || user === null) {
            setIsLoading(false);
            // console.log("Waiting for user data...");
            return; // Prevent unnecessary state update if user is not yet available
        }

        // console.log("Protected Route - User role:", user?.role, ", Required role:", requiredRole);
        if (user && (user.role === requiredRole || requiredRole === "user")) {
            setIsAuthorized(true);
        } else {
            setIsAuthorized(false);
        }
        // setIsAuthorized(true);
        setIsLoading(false);
    }, [user, requiredRole]);

    if (isLoading) {
        return <div>Loading...</div>; // Show a loading spinner while verifying
    }

    return isAuthorized ? children : <Navigate to="/" />;
};

export default ProtectedRoute;