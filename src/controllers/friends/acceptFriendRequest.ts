// src/api/friends/acceptFriendRequest.ts

const dataBaseServerUrl = import.meta.env.VITE_SERVER_URL;

export async function acceptFriendRequest(requesterId: number): Promise<void> {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${dataBaseServerUrl}/api/friends/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ requesterId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка при принятии заявки в друзья');
    }

    console.log('Заявка успешно принята');
  } catch (error) {
    console.error('Ошибка при принятии заявки:', error);
  }
}
