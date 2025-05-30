import axios from "axios";

const dataBaseServerUrl = import.meta.env.VITE_SERVER_URL;

/**
 * Получает доступные посты пользователя по его имени
 * @param username Имя пользователя, чьи посты нужно получить
 * @returns Массив постов
 * @throws Ошибка при отсутствии токена или неудачном запросе
 */
export async function getAllPosts(): Promise<any[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Пользователь не авторизован. Токен не найден.");
  }

  try {
    const response = await axios.get(`${dataBaseServerUrl}/api/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response good");
    return response.data.posts;
  } catch (error: unknown) {
    console.error("Ошибка при получении постов:", error);
    throw error;
  }
}
