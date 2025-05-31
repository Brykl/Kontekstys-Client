
import axios from 'axios';
const dataBaseServerUrl = import.meta.env.VITE_SERVER_URL;

// Тип данных пользователя
export interface UserInfo {
  id: number;
  username: string;
  email: string;
}

/**
 * Функция для получения списка пользователей с именем, содержащим заданную подстроку
 * @param query - часть имени или email для поиска
 * @returns массив пользователей, соответствующих запросу
 */
export interface UserInfo {
  id: number;
  username: string;
  email: string;
}

export async function getUsersByQuery(query: string): Promise<UserInfo[]> {
  try {
    const token = localStorage.getItem('token') || '';

    const response = await axios.get(`${dataBaseServerUrl}/api/friends/find`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { q: query },
    });

    return response.data as UserInfo[];
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    return [];
  }
}