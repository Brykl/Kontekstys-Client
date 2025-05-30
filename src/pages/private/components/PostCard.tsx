import React, { useState } from "react";
import axios from "axios";
import { Paper, Typography, Box } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import paperImage from "../../../assets/homePage/paper.avif";

interface Post {
  id: number;
  title: string;
  author_name: string;
  description: string;
  created_at: string;
  was_edited: boolean;
  like_count: string; // по-умолчанию из БД приходит string
  dislike_count: string; // тоже string
  img: string;
  viewer_reaction: "like" | "dislike" | null;
}

interface Props {
  post: Post;
}

const API_CREATE = "http://172.30.253.7:3891/api/reactions/create";
const API_UPDATE = "http://172.30.253.7:3891/api/reactions/update";
const BASE_URL = "http://172.30.253.7:3891";

const PostCard: React.FC<Props> = ({ post }) => {
  // Приводим к числу сразу при инициализации
  const [likeCount, setLikeCount] = useState<number>(Number(post.like_count));
  const [dislikeCount, setDislikeCount] = useState<number>(
    Number(post.dislike_count)
  );
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(
    post.viewer_reaction ?? null
  );

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: token ? `Bearer ${token}` : "" } };

  const handleLike = async () => {
    try {
      if (reaction === "like") {
        await axios.put(
          API_UPDATE,
          { postId: post.id, reactionType: "none" },
          config
        );
        setLikeCount((prev) => Math.max(0, prev - 1));
        setReaction(null);
      } else if (reaction === "dislike") {
        await axios.put(
          API_UPDATE,
          { postId: post.id, reactionType: "like" },
          config
        );
        setLikeCount((prev) => prev + 1);
        setDislikeCount((prev) => Math.max(0, prev - 1));
        setReaction("like");
      } else {
        await axios.post(
          API_CREATE,
          { postId: post.id, reactionType: "like" },
          config
        );
        setLikeCount((prev) => prev + 1);
        setReaction("like");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    try {
      if (reaction === "dislike") {
        await axios.put(
          API_UPDATE,
          { postId: post.id, reactionType: "none" },
          config
        );
        setDislikeCount((prev) => Math.max(0, prev - 1));
        setReaction(null);
      } else if (reaction === "like") {
        await axios.put(
          API_UPDATE,
          { postId: post.id, reactionType: "dislike" },
          config
        );
        setDislikeCount((prev) => prev + 1);
        setLikeCount((prev) => Math.max(0, prev - 1));
        setReaction("dislike");
      } else {
        await axios.post(
          API_CREATE,
          { postId: post.id, reactionType: "dislike" },
          config
        );
        setDislikeCount((prev) => prev + 1);
        setReaction("dislike");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isLiked = reaction === "like";
  const isDisliked = reaction === "dislike";

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
      <Typography variant="subtitle2" color="text.secondary">
        Автор: {post.author_name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {new Date(post.created_at).toLocaleString()}
      </Typography>

      {/* Изображение */}
      {post.img && (
        <Box
          component="img"
          src={`${BASE_URL}${post.img}`}
          alt={post.title}
          sx={{
            width: "100%",
            maxHeight: 300,
            objectFit: "contain",
            borderRadius: 2,
            mt: 2,
            mb: 1,
            boxShadow: "0 0 8px rgba(0,0,0,0.1)",
          }}
        />
      )}

      <Typography variant="body1" sx={{ mt: 1 }}>
        {post.description}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        {/* Лайк */}
        <Box
          onClick={handleLike}
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
            cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: isLiked ? "0 0 10px rgba(0,128,0,0.5)" : undefined,
            "&:hover": { boxShadow: "0 0 10px rgba(0,128,0,0.5)" },
          }}
        >
          <ThumbUpIcon
            sx={{
              fontSize: "35px",
              color: isLiked ? "green" : undefined,
              transition: "color 0.3s, transform 0.2s",
              "&:hover": { transform: "scale(1.2)" },
            }}
          />
          <Typography variant="caption">{likeCount}</Typography>
        </Box>

        {/* Дизлайк */}
        <Box
          onClick={handleDislike}
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
            cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: isDisliked ? "0 0 10px rgba(255,0,0,0.5)" : undefined,
            "&:hover": { boxShadow: "0 0 10px rgba(255,0,0,0.5)" },
          }}
        >
          <ThumbDownAltIcon
            sx={{
              fontSize: "35px",
              color: isDisliked ? "red" : undefined,
              transition: "color 0.3s, transform 0.2s",
              "&:hover": { transform: "scale(1.2)" },
            }}
          />
          <Typography variant="caption">{dislikeCount}</Typography>
        </Box>
      </Box>

      {post.was_edited && (
        <Typography variant="caption" color="warning.main" sx={{ mt: 1 }}>
          (редактировалось)
        </Typography>
      )}
    </Paper>
  );
};

export default PostCard;
