import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import paperImage from "../../../assets/homePage/paper.avif";
import bagr1 from "../../../assets/homePage/treygol1.jpg";
import { getAllPosts } from "../../../controllers/getAllPosts";
import AppBarPrivate from "../components/AppBar";
import PostCard from "../components/PostCard";

interface Post {
  id: number;
  title: string;
  author_name: string;
  description: string;
  created_at: string;
  was_edited: boolean;
}

const AllPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAllPosts();
        setPosts(response);
      } catch (err) {
        setError("Не удалось загрузить посты");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBarPrivate />

      <Box
        sx={{
          flex: 1,
          height: "100vh",
          backgroundImage: `url(${bagr1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          p: 3,
          display: "flex",
          justifyContent: "center",
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
              py: 1,
            }}
          >
            Все посты
          </Typography>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}

          {!loading && posts.length === 0 && (
            <Typography sx={{ mt: 2, textAlign: "center" }}>
              Нет доступных постов.
            </Typography>
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
            {posts.map((item) => (
              <PostCard key={item.id} post={item} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AllPostsPage;
