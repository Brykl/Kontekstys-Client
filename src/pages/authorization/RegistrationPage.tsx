import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import paperImage from "../../assets/homePage/paper.avif";
import bagr1 from "../../assets/homePage/treygol1.jpg";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const serverAddress = import.meta.env.VITE_SERVER_URL;

const RegistrationPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`${serverAddress}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Если ошибка — покажем её
        setErrorMessage(data.message || "Ошибка регистрации");
      } else {
        // Успешная регистрация
        setSuccessMessage(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1500); // через 1.5 сек перейти на логин
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Ошибка подключения к серверу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ overflow: "hidden", height: "100vh", width: "100vw" }}>
      <AppBar
        position="static"
        elevation={3}
        sx={{
          backgroundImage: `url(${paperImage})`,
          backgroundSize: "cover contented",
          backgroundPosition: "center",
          color: "#1e1e1f",
          backdropFilter: "blur(3px)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link} // Делаем Typography кликабельным через Link
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: "#591434",
              textDecoration: "none",
              ":hover": {
                textDecoration: "underline",
              },
            }}
          >
            Контекстус
          </Typography>

          <Button
            component={Link}
            to="/login"
            color="inherit"
            variant="outlined"
            sx={{ borderColor: "#1e1e1f", color: "#1e1e1f" }}
          >
            Войти
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${bagr1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, sm: 4 },
            maxWidth: "400px",
            width: "100%",
            backgroundImage: `url(${paperImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 3,
            backdropFilter: "blur(3px)",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Регистрация
          </Typography>

          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Почтовый адрес
              </Typography>
              <input
                type="email"
                placeholder="Введите почту"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Имя пользователя
              </Typography>
              <input
                type="text"
                placeholder="Введите имя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={inputStyle}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Пароль
              </Typography>
              <input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 1,
                backgroundColor: "#591434",
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 2,
                ":hover": {
                  backgroundColor: "#451027",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Создать аккаунт"
              )}
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              mt: 2,
              color: "#1e1e1f",
            }}
          >
            Уже есть аккаунт?{" "}
            <Link
              to="/login"
              style={{
                color: "#591434",
                fontWeight: "bold",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              Войти
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  backgroundColor: "rgba(255,255,255,0.9)",
};

export default RegistrationPage;
