import { AppBar, Toolbar, Typography, Button, Paper, Box } from "@mui/material";
import paperImage from "../../assets/homePage/paper.avif";
import bagr1 from "../../assets/homePage/treygol1.jpg";

const HomePage: React.FC = () => {
  return (
    <>
      <Box sx={{ overflow: "hidden", height: "100vh", width: "100vw" }}>
        <AppBar
          position="static"
          elevation={3}
          sx={{
            backgroundImage: `linear-gradient(rgba(66, 65, 65, 0.6), rgba(41, 40, 40, 0.6)), url(${paperImage})`,
            backgroundSize: "cover contented",
            backgroundPosition: "center",
            color: "#fceabb",
          }}
        >
          <Toolbar>
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
            >
              Контекстус
            </Typography>
            <Button color="inherit" sx={{ mr: 1 }}>
              Вход
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              sx={{ borderColor: "#fceabb", color: "#fceabb" }}
            >
              Регистрация
            </Button>
          </Toolbar>
        </AppBar>

        {/* Фон + контент */}
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
              sx={{ fontWeight: "bold" }}
            >
              Добро пожаловать в Контекстус
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Контекстус — современная социальная сеть, где каждый может
              делиться своими мыслями и идеями, создавать посты и находить
              единомышленников. Простота, удобство и безопасность — наши главные
              принципы.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Присоединяйтесь, чтобы быть в центре событий и контекста!
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
