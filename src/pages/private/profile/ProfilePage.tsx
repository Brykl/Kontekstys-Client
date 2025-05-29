import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import paperImage from "../../../assets/homePage/paper.avif";
import bagr1 from "../../../assets/homePage/treygol1.jpg";
import { getPosBName } from "../../../controllers/allProfPost";
import AppBarPrivate from "../components/AppBar";

interface Post {
  id: number;
  title: string;
  description: string;
  created_at: string;
  was_edited: boolean;
}

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (!username) return;

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getPosBName(username);

        if (response && Array.isArray(response.posts)) {
          setPosts(response.posts);
        } else if (Array.isArray(response)) {
          setPosts(response);
        } else {
          setPosts([]);
        }
      } catch (err) {
        setError("Не удалось загрузить посты");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [username]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* AppBar */}
      {/* <AppBar
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
      </AppBar> */}

      <AppBarPrivate />
      {/* Контейнер с фоном под AppBar */}

      <Box
        sx={{
          marginTop: 0,
          flex: 1, // занимает оставшееся пространство
          height: "100vh",
          backgroundImage: `url(${bagr1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          p: 3,
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "row",
          alignItems: "start",
          overflowY: "auto",
        }}
      >
        {/* Секция постов */}
        <Box
          sx={{
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              backgroundImage: `url(${paperImage})`,
              textAlign: "center",
              borderRadius: 3,
              backdropFilter: "blur(3px)",
            }}
          >
            Посты пользователя
          </Typography>

          {loading && <CircularProgress />}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {!loading && posts.length === 0 && (
            <Typography sx={{ mt: 2 }}>Нет доступных постов.</Typography>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
              maxHeight: "70vh",
              overflowY: "auto", // вертикальный скролл, если не помещается
              scrollbarWidth: "none", // Firefox
              "&::-webkit-scrollbar": {
                display: "none", // Chrome, Safari, Edge
              },
            }}
          >
            {posts.map((post) => (
              <Paper
                key={post.id}
                elevation={3}
                sx={{
                  p: 2,
                  backgroundImage: `url(${paperImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 3,
                  backdropFilter: "blur(3px)",
                }}
              >
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(post.created_at).toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {post.description}
                </Typography>
                {post.was_edited && (
                  <Typography variant="caption" color="warning.main">
                    (редактировалось)
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        </Box>
        {/* Карточка профиля */}
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, sm: 4 },
            maxWidth: "600px",
            width: "25vw",
            backgroundImage: `url(${paperImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 3,
            backdropFilter: "blur(3px)",
            mb: 4,
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
        </Paper>
      </Box>
    </Box>
  );
};

export default ProfilePage;
