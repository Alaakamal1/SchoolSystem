import { UseAuth as useAuth} from "../context/UseAuth";
import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import Loader from "./Loader";

const ProtectedRoute = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setIsAuthorized(false);
      } else if (role && user.role !== role) {
        setIsAuthorized(false);
      }
      // Authorized case
      else {
        setIsAuthorized(true);
      }
    }
  }, [user, isLoading, role]);

  // Still loading auth state
  if (isLoading || isAuthorized === null) {
    return <Loader className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"} />;
  }

  // Use replace to prevent navigation loops
  return isAuthorized ? children : <Navigate to="/login" replace />;
};

// const ProtectedRoute = ({ children }) => {
//   return children;
// };

export default ProtectedRoute;
