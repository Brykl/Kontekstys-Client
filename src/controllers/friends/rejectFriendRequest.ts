// src/api/friends/rejectFriendRequest.ts

const dataBaseServerUrl = import.meta.env.VITE_SERVER_URL;

export async function rejectFriendRequest(requesterId: number): Promise<void> {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${dataBaseServerUrl}/api/friends/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ requesterId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка при отклонении заявки в друзья');
    }

    console.log('Заявка успешно отклонена');
  } catch (error) {
    console.error('Ошибка при отклонении заявки:', error);
  }
}
