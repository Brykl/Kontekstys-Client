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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";

const dataBaseServerUrl = import.meta.env.VITE_SERVER_URL;

interface UploadImageModalProps {
  open: boolean;
  onClose: () => void;
  onPostCreated?: () => void; // для обновления списка постов после создания
}

const UploadIconModal: React.FC<UploadImageModalProps> = ({
  open,
  onClose,
  onPostCreated,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
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
    formData.append("is_public", String(isPublic));
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
      const response = await axios.post(
        `${dataBaseServerUrl}/api/icon/load`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // передаём токен авторизации
          },
        }
      );

      setUploadMessage("Пост успешно создан");
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      setIsPublic(true);

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
          <FormControlLabel
            control={
              <Checkbox
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
            }
            label="Сделать пост публичным"
          />
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

export default UploadIconModal;
