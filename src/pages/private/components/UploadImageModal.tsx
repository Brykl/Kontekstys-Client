import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import axios from "axios";

const dataBaseServerUrl = import.meta.env.VITE_SERVER_URL;

interface UploadImageModalProps {
  open: boolean;
  onClose: () => void;
  onPostCreated?: () => void; // для обновления списка постов после создания
}

const UploadImageModal: React.FC<UploadImageModalProps> = ({
  open,
  onClose,
  onPostCreated,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Теперь вместо isPublic используем accessType
  const [accessType, setAccessType] = useState<"public" | "private" | "friends">(
    "public"
  );
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleCreatePost = async () => {
    if (!title || !description) {
      setUploadMessage("Пожалуйста, заполните все поля");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("accessType", accessType);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    // Получаем токен из localStorage (замени ключ, если у тебя другой)
    const token = localStorage.getItem("token");

    if (!token) {
      setUploadMessage("Ошибка: пользователь не авторизован");
      return;
    }

    try {
      await axios.post(
        `${dataBaseServerUrl}/api/posts/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // передаём токен авторизации
          },
        }
      );

      setUploadMessage("Пост успешно создан");
      // Сбросим поля формы
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      setAccessType("public");

      if (onPostCreated) onPostCreated();
      onClose();
    } catch (error) {
      console.error("Ошибка при создании поста:", error);
      setUploadMessage("Ошибка создания поста");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Создать пост</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
          />
          <Button component="label" variant="outlined">
            Выбрать изображение
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {selectedFile && (
            <Typography variant="body2" color="textSecondary">
              Выбрано: {selectedFile.name}
            </Typography>
          )}
          <Typography variant="subtitle1">Уровень доступа</Typography>
          <RadioGroup
            value={accessType}
            onChange={(e) =>
              setAccessType(e.target.value as "public" | "private" | "friends")
            }
            row
          >
            <FormControlLabel
              value="public"
              control={<Radio />}
              label="Публичный"
            />
            <FormControlLabel
              value="private"
              control={<Radio />}
              label="Только я"
            />
            <FormControlLabel
              value="friends"
              control={<Radio />}
              label="Только друзья"
            />
          </RadioGroup>
          {uploadMessage && (
            <Typography color="textSecondary">{uploadMessage}</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleCreatePost}>
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadImageModal;
