import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const dataBaseServerUrl = import.meta.env.VITE_SERVER_URL;

const useUserIcon = () => {
  const { username } = useParams<{ username: string }>();
  const [iconUrl, setIconUrl] = useState<string>("");

  useEffect(() => {
    const fetchIcon = async () => {
      if (!username) return;
      try {
        const response = await fetch(
          `${dataBaseServerUrl}/api/icon/${username}`
        );
        if (!response.ok) throw new Error("Ошибка при получении иконки");
        const data = await response.json();
        if (data.iconUrl) {
          setIconUrl(`${dataBaseServerUrl}${data.iconUrl}`);
        }
      } catch (error) {
        console.error("Ошибка при загрузке иконки:", error);
      }
    };

    fetchIcon();
  }, [username]);

  return iconUrl;
};

export default useUserIcon;
