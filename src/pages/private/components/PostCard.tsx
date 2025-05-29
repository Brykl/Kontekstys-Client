import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import paperImage from "../../../assets/homePage/paper.avif";

interface Post {
  id: number;
  title: string;
  description: string;
  created_at: string;
  was_edited: boolean;
  like_count: number;
  dislike_count: number;
  viewer_reaction: "like" | "dislike" | null;
}

interface Props {
  post: Post;
}

const PostCard: React.FC<Props> = ({ post }) => {
  const isLiked = post.viewer_reaction === "like";
  const isDisliked = post.viewer_reaction === "dislike";

  const handleLike = () => {
    console.log("Лайк:", post.id);
    // тут будет запрос на сервер
  };

  const handleDislike = () => {
    console.log("Дизлайк:", post.id);
    // тут будет запрос на сервер
  };

  return (
    <Paper
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

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        {/* Лайк */}
        <Box
          sx={{
            bgcolor: "#f9f9ff",
            border: "1px solid gray",
            width: "55px",
            height: "55px",
            borderTopRightRadius: "16px",
            borderBottomRightRadius: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s",
            "&:hover": {
              boxShadow: "0 0 10px rgba(0, 128, 0, 0.5)",
            },
          }}
        >
          <ThumbUpIcon
            onClick={handleLike}
            sx={{
              fontSize: "35px",
              cursor: "pointer",
              transition: "color 0.3s, transform 0.2s",
              color: isLiked ? "green" : undefined,
              "&:hover": {
                color: "green",
                transform: "scale(1.2)",
              },
            }}
          />
          <Typography variant="caption">{post.like_count}</Typography>
        </Box>

        {/* Дизлайк */}
        <Box
          sx={{
            bgcolor: "#f9f9ff",
            border: "1px solid gray",
            width: "55px",
            height: "55px",
            borderTopLeftRadius: "16px",
            borderBottomLeftRadius: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s",
            "&:hover": {
              boxShadow: "0 0 10px rgba(255, 0, 0, 0.5)",
            },
          }}
        >
          <ThumbDownAltIcon
            onClick={handleDislike}
            sx={{
              fontSize: "35px",
              cursor: "pointer",
              transition: "color 0.3s, transform 0.2s",
              color: isDisliked ? "red" : undefined,
              "&:hover": {
                color: "red",
                transform: "scale(1.2)",
              },
            }}
          />
          <Typography variant="caption">{post.dislike_count}</Typography>
        </Box>
      </Box>

      {post.was_edited && (
        <Typography variant="caption" color="warning.main">
          (редактировалось)
        </Typography>
      )}
    </Paper>
  );
};

export default PostCard;
