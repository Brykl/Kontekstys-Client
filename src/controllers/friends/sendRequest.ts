const dataBaseServerUrl = import.meta.env.VITE_SERVER_URL;

export async function sendFriendRequest(toUserId: number): Promise<void> {
  try {
    const token = localStorage.getItem('token'); // или откуда у тебя хранится токен

    const response = await fetch(`${dataBaseServerUrl}/api/friends/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }), // добавляем Authorization, если токен есть
      },
      body: JSON.stringify({ toUserId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка при отправке запроса в друзья');
    }

    console.log('Заявка в друзья успешно отправлена');
  } catch (error) {
    console.error('Ошибка:', error);
  }
}
