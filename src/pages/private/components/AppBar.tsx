import React, { type JSX } from "react";
import paperImage from "../../../assets/homePage/paper.avif";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Person2Icon from "@mui/icons-material/Person2";
import GroupIcon from "@mui/icons-material/Group";
import ChatIcon from "@mui/icons-material/Chat";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function AppBarPrivate(): JSX.Element {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  // Стили для иконок и текста с анимацией
  const navItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    px: 1.5,
    py: 0.5,
    borderRadius: 2,
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(30,30,31,0.1)",
      transform: "scale(1.05)",
    },
  };

  return (
    <AppBar
      position="static"
      elevation={3}
      sx={{
        backgroundImage: `url(${paperImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#1e1e1f",
        backdropFilter: "blur(3px)",
      }}
    >
      <Toolbar>
        {/* Название приложения */}
        <Typography variant="h6" sx={{ fontWeight: "bold", mr: 4 }}>
          Контекстус
        </Typography>

        {/* Навигационные иконки */}
        <Box
          sx={{ display: "flex", gap: 2, alignItems: "center", flexGrow: 1 }}
        >
          <Box sx={navItemStyle}>
            <Person2Icon fontSize="small" />
            <Typography variant="body1">Профиль</Typography>
          </Box>
          <Box sx={navItemStyle}>
            <GroupIcon fontSize="small" />
            <Typography variant="body1">Друзья</Typography>
          </Box>
          <Box sx={navItemStyle}>
            <ChatIcon fontSize="small" />
            <Typography variant="body1">Чат</Typography>
          </Box>
          <Box sx={navItemStyle}>
            <AdminPanelSettingsIcon fontSize="small" />
            <Typography variant="body1">Администрирование</Typography>
          </Box>
        </Box>

        {/* Кнопка выхода */}
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
  );
}
