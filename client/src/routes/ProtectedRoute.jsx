// components/ProtectedRoute.js 
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children, roles }) => {
	const { role } = useAuth();

	if(!role) {
		// If the role is not defined yet (loading or not authenticated)
		return <div>Loading...</div>;
	}

	if(!roles.includes(role)) {
		// If the user's role is not in the allowed roles, redirect to home page or a not authorized page
		return <Navigate to="/" />;
	}

	return children;
};

export default ProtectedRoute;
