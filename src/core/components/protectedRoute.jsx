import { Navigate } from "react-router";
import Loader from "./Loader";
import UseAuth from "../context/UseAuth";

const ProtectedRoute = ({ children, role }) => {
  const { user, isLoading } = UseAuth();

  if (isLoading) {
    return (
      <Loader className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

