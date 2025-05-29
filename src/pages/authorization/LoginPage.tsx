import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Paper, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import paperImage from "../../assets/homePage/paper.avif";
import bagr1 from "../../assets/homePage/treygol1.jpg";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://172.30.253.7:3891/api/auth/login",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        const { token, user } = response.data;
        const userName: string = await user.user_name;

        localStorage.setItem("token", token);
        navigate(`/profile/${userName}`, {
          replace: true,
        });
      } else {
        setError("Не удалось войти. Попробуйте снова.");
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Ошибка сервера. Попробуйте позже.");
      }
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
            component={Link}
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
            to="/registration"
            color="inherit"
            variant="outlined"
            sx={{ borderColor: "#1e1e1f", color: "#1e1e1f" }}
          >
            Регистрация
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
            Вход в Контекстус
          </Typography>

          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
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
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                  backgroundColor: "rgba(255,255,255,0.9)",
                }}
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
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                  backgroundColor: "rgba(255,255,255,0.9)",
                }}
              />
            </Box>

            {error && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mb: 2, textAlign: "center" }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
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
              Войти
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
            Нет аккаунта?{" "}
            <Link
              to="/registration"
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
              Создать аккаунт
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;
