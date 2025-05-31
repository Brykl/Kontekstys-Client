const dataBaseServerUrl = import.meta.env.VITE_SERVER_URL;

export async function removeFriend(friendId: number): Promise<void> {
  const token = localStorage.getItem('token');

  const response = await fetch(`${dataBaseServerUrl}/api/friends/remove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ friendId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ошибка при удалении друга');
  }
}
