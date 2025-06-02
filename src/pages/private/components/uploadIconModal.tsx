import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
const dataBaseServerUrl = import.meta.env.VITE_SERVER_URL;

interface UploadIconModalProps {
  open: boolean;
  onClose: () => void;
  onUploaded?: (newIconUrl: string) => void;
  currentIconUrl?: string;
  token: string;
}

const UploadIconModal: React.FC<UploadIconModalProps> = ({
  open,
  onClose,
  onUploaded,
  currentIconUrl,
  token,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("icon", selectedFile);

    try {
      const response = await axios.post(
        `${dataBaseServerUrl}/api/load/icon`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUploaded?.(response.data.iconUrl);
      onClose();
    } catch (error) {
      console.error("Ошибка загрузки иконки:", error);
      alert("Ошибка при загрузке. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Загрузка иконки</DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center", my: 2 }}>
          <Avatar
            src={preview || currentIconUrl || ""}
            sx={{ width: 120, height: 120, mx: "auto" }}
            variant="rounded"
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Выберите изображение (jpg, png)
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginTop: 12 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Отмена
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          variant="contained"
        >
          {loading ? <CircularProgress size={24} /> : "Загрузить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadIconModal;
