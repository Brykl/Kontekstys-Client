import React, { useState, useEffect } from "react";
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
  onPostCreated?: () => void; // колбэк для обновления списка постов после создания
}

const UploadImageModal: React.FC<UploadImageModalProps> = ({
  open,
  onClose,
  onPostCreated,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [accessType, setAccessType] = useState<
    "public" | "private" | "friends"
  >("public");
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");

  // Сбрасываем состояние, когда модалка открывается
  useEffect(() => {
    if (open) {
      setSelectedFile(null);
      setTitle("");
      setDescription("");
      setAccessType("public");
      setServerError(null);
      setUploadMessage("");
    }
  }, [open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setServerError(null); // сбрасываем предыдущую ошибку
  };

  const handleCreatePost = async () => {
    // Сброс ошибок
    setServerError(null);
    setUploadMessage("");

    // Клиентская валидация
    if (!title.trim() || !description.trim()) {
      setUploadMessage("Пожалуйста, заполните все поля");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("accessType", accessType);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    // Получаем токен из localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setUploadMessage("Ошибка: пользователь не авторизован");
      return;
    }

    try {
      const response = await axios.post(
        `${dataBaseServerUrl}/api/posts/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUploadMessage("Пост успешно создан");
      // Сброс полей
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      setAccessType("public");

      onPostCreated?.();
      onClose();
    } catch (error: any) {
      // error.request.response – это строка JSON вида {"message":"…"}
      let messageToShow = "Ошибка создания поста";

      if (error.request && typeof error.request.response === "string") {
        try {
          const parsed = JSON.parse(error.request.response);
          if (parsed && typeof parsed.message === "string") {
            messageToShow = parsed.message;
          }
        } catch {
          // Если парсинг провалился, оставляем messageToShow = "Ошибка создания поста"
        }
      }

      setServerError(messageToShow);
      console.error("Ошибка при создании поста:", messageToShow);
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
            onChange={(e) => {
              setTitle(e.target.value);
              setServerError(null);
            }}
            fullWidth
            required
          />
          <TextField
            label="Описание"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setServerError(null);
            }}
            fullWidth
            multiline
            rows={4}
            required
          />

          <Button component="label" variant="outlined">
            Выбрать изображение (jpg, png)
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

          {/* Покажем служебное сообщение (валидация) */}
          {uploadMessage && (
            <Typography color="textSecondary">{uploadMessage}</Typography>
          )}

          {/* Покажем именно ошибку с сервера, если она есть */}
          {serverError && (
            <Typography variant="body2" color="error">
              {serverError}
            </Typography>
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
