const dataBaseServerUrl = import.meta.env.VITE_SERVER_URL;

export interface FriendRequest {
  id: number;          // id запроса или id пользователя, кто отправил заявку (зависит от API)
  user_name: string;   // имя пользователя, который отправил запрос
  email: string;       // email пользователя
  // ... другие поля, если есть
}

export async function getFriendRequests(): Promise<FriendRequest[]> {
  try {
    const token = localStorage.getItem('token'); // или другой источник токена

    const response = await fetch(`${dataBaseServerUrl}/api/friends/request/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка при получении запросов в друзья');
    }

    const data: FriendRequest[] = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    return [];
  }
}
