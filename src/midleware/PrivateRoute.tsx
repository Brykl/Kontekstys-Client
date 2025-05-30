import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Box } from "@mui/material";
import { useUser } from "../contexts/AuthContext"; // импортируем хук контекста

const serverAddress = import.meta.env.VITE_SERVER_URL;

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { setUser } = useUser();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const response = await axios.post(
          `${serverAddress}/api/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setUser(response.data.user); // сохраняем пользователя в контекст
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error(err);
        setIsAuthorized(false);
      }
    };

    verifyToken();
  }, [setUser]);

  if (isAuthorized === null) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthorized ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
