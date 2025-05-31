import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Button,
  Avatar,
} from "@mui/material";
import paperImage from "../../../assets/homePage/paper.avif";
import backgroundImg from "../../../assets/homePage/treygol1.jpg";
import { getPosBName } from "../../../controllers/allProfPost";
import AppBarPrivate from "../components/AppBar";
import PostCard from "../components/PostCard";
import UploadImageModal from "../components/UploadImageModal";
import UploadIconModal from "../components/uploadIconModal";
import { useUser } from "../../../contexts/AuthContext";
import defaultAvatar from "../../../assets/private/avatar.svg";
import EditIcon from "@mui/icons-material/Edit";
import useUserIcon from "../../../controllers/getIcon";

interface Post {
  id: number;
  title: string;
  description: string;
  created_at: string;
  was_edited: boolean;
  author_name?: string;
  like_count: string;
  dislike_count: string;
  viewer_reaction: "like" | "dislike" | null;
  img: string;
}

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useUser();
  const navigate = useNavigate();

  const token = localStorage.getItem("token") || "";


  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openIconModal, setOpenIconModal] = useState(false);

  const iconUrlFromServer = useUserIcon();

  const fetchPosts = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getPosBName(username);
      let rawPosts: any[] = [];
      if (response && Array.isArray(response.posts)) rawPosts = response.posts;
      else if (Array.isArray(response)) rawPosts = response;
      const postsWithAuthor = rawPosts.map((post) => ({
        ...post,
        author_name: username,
      }));
      setPosts(postsWithAuthor);
    } catch {
      setError("Не удалось загрузить посты");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostDeleted = (postId: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBarPrivate />
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${backgroundImg})`,
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
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />
            ))}
          </Box>
        </Box>

        {/* Боковая панель профиля */}
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
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box
              sx={{
                position: "relative",
                width: 200,
                height: 200,
                borderRadius: 1,
                overflow: "hidden",
                cursor: user?.user_name === username ? "pointer" : "default",
                "&:hover .overlay": {
                  opacity: user?.user_name === username ? 1 : 0,
                },
              }}
              onClick={() => {
                if (user?.user_name === username) {
                  setOpenIconModal(true);
                }
              }}
            >
              <Avatar
                src={iconUrlFromServer || defaultAvatar}
                alt={username}
                sx={{ width: "100%", height: "100%", borderRadius: 1 }}
              />
              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s",
                  color: "white",
                }}
              >
                <EditIcon fontSize="large" />
              </Box>
            </Box>
          </Box>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Имя пользователя: <strong>{username}</strong>
          </Typography>
          {user?.user_name === username && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setOpenUploadModal(true)}
              >
                Создать новый пост
              </Button>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Модальные окна */}
      <UploadImageModal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        onPostCreated={() => {
          setOpenUploadModal(false);
          fetchPosts();
        }}
      />

      <UploadIconModal
        open={openIconModal}
        onClose={() => setOpenIconModal(false)}
        onUploaded={() => setOpenIconModal(false)}
        token={token}
      />
    </Box>
  );
};

export default ProfilePage;
