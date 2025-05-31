import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Avatar,
  ListItemAvatar,
} from '@mui/material';
import AppBar from '../components/AppBar';
import { getUsersByQuery, type UserInfo } from '../../../controllers/getUsersByQuery';
import { sendFriendRequest } from '../../../controllers/friends/sendRequest';
import { getFriendRequests, type FriendRequest } from '../../../controllers/friends/getFriendRequests';
import DEFAULT_AVATAR from "../../../assets/private/avatar.svg"
import { getAllFriends } from '../../../controllers/friends/getAllFriends';

interface Friend {
  id: number;
  user_name: string;
  email: string;
  icon_url?: string | null;
}

// const DEFAULT_AVATAR = 'https://via.placeholder.com/40?text=User';
const BASE_URL = 'http://172.30.0.66:3891';

const AddFriendsPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [friendQuery, setFriendQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(false);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleAddFriend = async (userId: number) => {
    await sendFriendRequest(userId);
  };

  const handleChangeFriendQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFriendQuery(event.target.value);
  };

  const handleSearchClick = async () => {
    if (!friendQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const users = await getUsersByQuery(friendQuery);
      setSearchResults(users);
    } catch (error) {
      setSearchResults([]);
      console.error('Ошибка при поиске друзей:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка входящих заявок
  useEffect(() => {
    if (tabIndex === 2) {
      setRequestsLoading(true);
      getFriendRequests()
        .then((requests) => setFriendRequests(requests))
        .catch((e) => {
          console.error('Ошибка при загрузке запросов:', e);
          setFriendRequests([]);
        })
        .finally(() => setRequestsLoading(false));
    }
  }, [tabIndex]);

  // Загрузка списка друзей (заглушка)
  useEffect(() => {
  if (tabIndex === 0) {
    const fetchFriends = async () => {
      setFriendsLoading(true);
      try {
        const friendsList = await getAllFriends();
        setFriends(friendsList);
      } catch (e) {
        console.error('Ошибка при загрузке друзей:', e);
        setFriends([]);
      } finally {
        setFriendsLoading(false);
      }
    };
    fetchFriends();
  }
}, [tabIndex]);


  const handleAcceptRequest = (id: number) => {
    console.log(`Принять запрос от пользователя с id=${id}`);
  };

  const handleRejectRequest = (id: number) => {
    console.log(`Отклонить запрос от пользователя с id=${id}`);
  };

  const handleRemoveFriend = (id: number) => {
    console.log(`Удалить пользователя с id=${id} из друзей`);
  };

  // Хелпер для формирования полного URL аватарки или дефолтного
  const getAvatarUrl = (iconUrl?: string | null) => {
    if (iconUrl) {
      // icon_url может начинаться с "/", тогда склеим с BASE_URL
      return iconUrl.startsWith('http') ? iconUrl : BASE_URL + iconUrl;
    }
    return DEFAULT_AVATAR;
  };

  return (
    <Box>
      <AppBar />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Tabs value={tabIndex} onChange={handleChangeTab} centered>
          <Tab label="Твои друзья" />
          <Tab label="Найти друга" />
          <Tab label="Запросы" />
        </Tabs>

        {/* Вкладка: Твои друзья */}
        {tabIndex === 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Твои друзья
            </Typography>
            <Paper sx={{ p: 2 }} elevation={2}>
              {friendsLoading ? (
                <Typography>Загрузка...</Typography>
              ) : friends.length === 0 ? (
                <Typography variant="body1">У тебя пока нет друзей.</Typography>
              ) : (
                <List>
                  {friends.map((friend) => (
                    <ListItem
                      key={friend.id}
                      secondaryAction={
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemoveFriend(friend.id)}
                        >
                          Удалить
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar src={getAvatarUrl(friend.icon_url)} alt={friend.user_name} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={friend.user_name}
                        secondary={friend.email}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>
        )}

        {/* Вкладка: Найти друга */}
        {tabIndex === 1 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Найти друга
            </Typography>

            <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
              <TextField
                fullWidth
                label="Имя пользователя или Email"
                value={friendQuery}
                onChange={handleChangeFriendQuery}
                placeholder="Введите имя или почту"
              />

              <Button
                variant="contained"
                sx={{ mt: 2 }}
                fullWidth
                onClick={handleSearchClick}
                disabled={isLoading}
              >
                {isLoading ? 'Идет поиск...' : 'Поиск'}
              </Button>
            </Paper>

            <Typography variant="h6" gutterBottom>
              Результаты поиска
            </Typography>

            <Paper sx={{ p: 2 }} elevation={1}>
              {searchResults.length === 0 && !isLoading ? (
                <Typography variant="body2" color="text.secondary">
                  Ничего не найдено.
                </Typography>
              ) : (
                <List>
                  {searchResults.map((user) => (
                    <ListItem
                      key={user.id}
                      secondaryAction={
                        <Button
                          variant="outlined"
                          onClick={() => handleAddFriend(user.id)}
                        >
                          Добавить
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar src={getAvatarUrl(user.icon_url)} alt={user.user_name} />
                      </ListItemAvatar>
                      <ListItemText primary={user.user_name} secondary={user.email} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>
        )}

        {/* Вкладка: Запросы */}
        {tabIndex === 2 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Запросы в друзья
            </Typography>
            <Paper sx={{ p: 2 }} elevation={2}>
              {requestsLoading ? (
                <Typography>Загрузка...</Typography>
              ) : friendRequests.length === 0 ? (
                <Typography variant="body1">Нет новых запросов.</Typography>
              ) : (
                <List>
                  {friendRequests.map((request) => (
                    <ListItem
                      key={request.id}
                      secondaryAction={
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            sx={{ mr: 1 }}
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            Принять
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            Отклонить
                          </Button>
                        </>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar src={getAvatarUrl(request.icon_url)} alt={request.user_name} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={request.user_name}
                        secondary={request.email}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AddFriendsPage;
