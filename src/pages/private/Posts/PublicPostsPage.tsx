import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import paperImage from "../../../assets/homePage/paper.avif";
import bagr1 from "../../../assets/homePage/treygol1.jpg";
import { getAllPosts } from "../../../controllers/getAllPosts";
import AppBarPrivate from "../components/AppBar"; // предполагаем, что оно принимает prop position
import PostCard from "../components/PostCard";

interface Post {
  id: number;
  title: string;
  author_name: string;
  description: string;
  created_at: string;
  was_edited: boolean;
  like_count?: number;
  dislike_count?: number;
  viewer_reaction?: "like" | "dislike" | null;
}

const AllPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllPosts();
        const postsWithDefaults = response.map((post: Post) => ({
          ...post,
          like_count: post.like_count ?? 0,
          dislike_count: post.dislike_count ?? 0,
          viewer_reaction: post.viewer_reaction ?? null,
        }));
        setPosts(postsWithDefaults);
      } catch {
        setError("Не удалось загрузить посты");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        /* прячем полосу прокрутки */
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {/* Сделали AppBar статичным */}
      <AppBarPrivate position="static" />

      {/* Контент */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${bagr1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          pt: 3,
          px: 3,
          pb: 0,
          display: "flex",
          flexDirection: "column",
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

        {/* Скрытый скролл, но возможность скроллить */}
        <Box
          sx={{
            flex: 1,
            mt: 2,
            overflowY: "auto",
            /* прячем полосу прокрутки */
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Grid container spacing={2} sx={{ height: "100%" }}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <PostCard post={post} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default AllPostsPage;
