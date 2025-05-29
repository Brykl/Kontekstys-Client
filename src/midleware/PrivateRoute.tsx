import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Box } from "@mui/material";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3891/api/verify",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
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
  }, []);

  // Пока проверяется токен — показываем индикатор загрузки
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

  // Если авторизован — отрисовываем защищённый контент
  return isAuthorized ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
