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
    // Если токен не найден — прерываем выполнение с ошибкой
    throw new Error("Пользователь не авторизован. Токен не найден.");
  }

  try {
    // Выполняем GET-запрос к серверу для получения постов пользователя
    const response = await axios.get(
      `${dataBaseServerUrl}/api/posts/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Возвращаем массив постов из тела ответа
    return response.data.posts;
  } catch (error: unknown) {
    // Логируем и пробрасываем ошибку дальше
    console.error("Ошибка при получении постов:", error);
    throw error;
  }
}
