import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth({ allowedRoles }) {
    const { isLoggedIn, role } = useSelector((state) => state.auth);
    const location = useLocation();

    if (isLoggedIn && allowedRoles.includes(role)) {
        return <Outlet />;
    }

    if (isLoggedIn) {
        return <Navigate to="/denied" replace />;
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
}

export default RequireAuth;