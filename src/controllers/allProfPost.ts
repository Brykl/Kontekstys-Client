import axios from "axios";

// URL сервера для запросов API
const dataBaseServerUrl = import.meta.env.VITE_SERVER_URL;

/**
 * Получает доступные посты пользователя по его имени
 * @param username Имя пользователя, чьи посты нужно получить
 * @returns Массив постов
 * @throws Ошибка при отсутствии токена или неудачном запросе
 */
export async function getPosBName(username: string): Promise<any[]> {
  // Получаем токен авторизации из localStorage
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Пользователь не авторизован. Токен не найден.");
  }

  try {
    const response = await axios.get(
      `${dataBaseServerUrl}/api/posts/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.posts;
  } catch (error: unknown) {
    console.error("Ошибка при получении постов:", error);
    throw error;
  }
}
