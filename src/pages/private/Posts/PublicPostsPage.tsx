import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import paperImage from "../../../assets/homePage/paper.avif";
import bagr1 from "../../../assets/homePage/treygol1.jpg";
import { getAllPosts } from "../../../controllers/getAllPosts";
import AppBarPrivate from "../components/AppBar";
import PostCard from "../components/PostCard";

// Интерфейс поста с access_type
interface Post {
  id: number;
  title: string;
  author_name: string;
  description: string;
  created_at: string;
  was_edited: boolean;
  like_count: number;
  dislike_count: number;
  viewer_reaction: "like" | "dislike" | null;
  access_type: "public" | "friends" | "private";
}

const AllPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortType, setSortType] = useState<"default" | "likes" | "access">("default");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllPosts();
      const postsWithDefaults: Post[] = response.map((post: any) => ({
        ...post,
        like_count: Number(post.like_count ?? 0),
        dislike_count: Number(post.dislike_count ?? 0),
        viewer_reaction: post.viewer_reaction ?? null,
        access_type: post.access_type ?? "public",
      }));
      setPosts(postsWithDefaults);
    } catch {
      setError("Не удалось загрузить посты");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = (postId: number) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const getSortedPosts = () => {
    const postsCopy = [...posts];
    if (sortType === "likes") {
      return postsCopy.sort((a, b) => b.like_count - a.like_count);
    }
    if (sortType === "access") {
      const order = { public: 0, friends: 1, private: 2 };
      return postsCopy.sort((a, b) => order[a.access_type] - order[b.access_type]);
    }
    return postsCopy;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <AppBarPrivate position="static" />

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

        <FormControl sx={{ mt: 2, minWidth: 200, alignSelf: "center" }} size="small">
          <InputLabel id="sort-label">Сортировать</InputLabel>
          <Select
            labelId="sort-label"
            value={sortType}
            label="Сортировать"
            onChange={(e) => setSortType(e.target.value as typeof sortType)}
          >
            <MenuItem value="default">По умолчанию</MenuItem>
            <MenuItem value="likes">По лайкам</MenuItem>
            <MenuItem value="access">По приватности</MenuItem>
          </Select>
        </FormControl>

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
            flex: 1,
            mt: 2,
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {getSortedPosts().map((post) => (
              <Box key={post.id} sx={{ maxWidth: "50vw", mt: 6, minWidth: "30vw" }}>
                <PostCard post={post} onDelete={handleDeletePost} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AllPostsPage;
