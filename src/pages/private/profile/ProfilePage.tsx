import { useNavigate, useParams } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Paper, Box } from "@mui/material";
import paperImage from "../../../assets/homePage/paper.avif";
// import bagr1 from "../../../assets/private/mainBg.jpg";
// import bagr1 from "../../../assets/private/v2.jpg";
import bagr1 from "../../../assets/homePage/treygol1.jpg";

const ProfilePage: React.FC = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  // Обработчик выхода
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <Box sx={{ overflow: "hidden", height: "100vh", width: "100vw" }}>
      {/* Верхняя панель */}
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
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Контекстус
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleLogout}
            sx={{ borderColor: "#1e1e1f", color: "#1e1e1f" }}
          >
            Выйти
          </Button>
        </Toolbar>
      </AppBar>

      {/* Фоновая зона и карточка профиля */}
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
            maxWidth: "600px",
            width: "100%",
            backgroundImage: `url(${paperImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 3,
            backdropFilter: "blur(3px)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Профиль пользователя
          </Typography>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Имя пользователя: <strong>{username}</strong>
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            Здесь можно будет отобразить вашу личную информацию, посты,
            настройки и другие данные.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            В будущем вы сможете редактировать профиль, управлять подписками и
            следить за активностью.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProfilePage;
