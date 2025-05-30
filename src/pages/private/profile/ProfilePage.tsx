/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import paperImage from "../../../assets/homePage/paper.avif";
import bagr1 from "../../../assets/homePage/treygol1.jpg";
import { getPosBName } from "../../../controllers/allProfPost";
import AppBarPrivate from "../components/AppBar";
import PostCard from "../components/PostCard";
import UploadImageModal from "../components/UploadImageModal"; // ✅ импорт модалки

interface Post {
  id: number;
  title: string;
  description: string;
  created_at: string;
  was_edited: boolean;
  author_name?: string;
}

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openUploadModal, setOpenUploadModal] = useState(false); // ✅ состояние для модалки

  // Вынесем fetchPosts из useEffect чтобы можно было вызывать и вручную
  const fetchPosts = useCallback(async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getPosBName(username);

      let rawPosts = [];

      if (response && Array.isArray(response.posts)) {
        rawPosts = response.posts;
      } else if (Array.isArray(response)) {
        rawPosts = response;
      }

      const postsWithAuthor = rawPosts.map((post) => ({
        ...post,
        author_name: username,
      }));

      setPosts(postsWithAuthor);
    } catch (err) {
      setError("Не удалось загрузить посты");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBarPrivate />

      <Box
        sx={{
          marginTop: 0,
          flex: 1,
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
        <Box sx={{ maxWidth: "600px", width: "100%" }}>
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
              overflowY: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
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

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button variant="outlined" onClick={() => setOpenUploadModal(true)}>
              Создать новый пост
            </Button>
          </Box>
        </Paper>
      </Box>

      <UploadImageModal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        onPostCreated={() => {
          setOpenUploadModal(false);
          fetchPosts();
        }}
      />
    </Box>
  );
};

export default ProfilePage;
