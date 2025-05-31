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
import { getFriendRequests as fetchFriendRequests, type FriendRequest } from '../../../controllers/friends/getFriendRequests';
import { getAllFriends } from '../../../controllers/friends/getAllFriends';
import { acceptFriendRequest } from '../../../controllers/friends/acceptFriendRequest';
import { rejectFriendRequest } from '../../../controllers/friends/rejectFriendRequest';
import { removeFriend } from '../../../controllers/friends/removeFriend'; // импорт контроллера удаления друга
import DEFAULT_AVATAR from '../../../assets/private/avatar.svg';

const BASE_URL = 'http://172.30.0.66:3891';

interface Friend {
  id: number;
  user_name: string;
  email: string;
  icon_url?: string | null;
}

const AddFriendsPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  const handleChangeTab = (_: React.SyntheticEvent, newIndex: number) => {
    setCurrentTab(newIndex);
  };

  useEffect(() => {
    if (currentTab !== 0) return;

    const loadFriends = async () => {
      setIsLoadingFriends(true);
      try {
        const friendsList = await getAllFriends();
        setFriends(friendsList);
      } catch (e) {
        console.error('Ошибка при загрузке друзей:', e);
        setFriends([]);
      } finally {
        setIsLoadingFriends(false);
      }
    };

    loadFriends();
  }, [currentTab]);

  useEffect(() => {
    if (currentTab !== 2) return;

    const loadRequests = async () => {
      setIsLoadingRequests(true);
      try {
        const { received, sent } = await fetchFriendRequests();
        setIncomingRequests(received);
        setSentRequests(sent);
      } catch (e) {
        console.error('Ошибка при загрузке запросов:', e);
        setIncomingRequests([]);
        setSentRequests([]);
      } finally {
        setIsLoadingRequests(false);
      }
    };

    loadRequests();
  }, [currentTab]);

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClickSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const users = await getUsersByQuery(searchQuery);
      setSearchResults(users);
    } catch (e) {
      console.error('Ошибка при поиске пользователей:', e);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (userId: number) => {
    try {
      await sendFriendRequest(userId);
      const sentUser = searchResults.find((u) => u.id === userId);
      if (sentUser) {
        setSentRequests((prev) => [...prev, sentUser]);
      }
      setSearchResults((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      // Ошибка уже залогирована в sendFriendRequest
    }
  };

  const handleAcceptRequest = async (userId: number) => {
    try {
      await acceptFriendRequest(userId);
      const updatedFriends = await getAllFriends();
      setFriends(updatedFriends);
      setIncomingRequests((prev) => prev.filter((u) => u.id !== userId));
    } catch (e) {
      console.error(`Ошибка при принятии заявки от пользователя ${userId}:`, e);
    }
  };

  const handleRejectRequest = async (userId: number) => {
    try {
      await rejectFriendRequest(userId);
      setIncomingRequests((prev) => prev.filter((u) => u.id !== userId));
    } catch (e) {
      console.error(`Ошибка при отклонении заявки от пользователя ${userId}:`, e);
    }
  };

  // Новый обработчик удаления друга
  const handleRemoveFriend = async (userId: number) => {
    try {
      await removeFriend(userId);
      // Обновляем список друзей после удаления
      const updatedFriends = await getAllFriends();
      setFriends(updatedFriends);
    } catch (e) {
      console.error(`Ошибка при удалении друга с ID ${userId}:`, e);
    }
  };

  const getAvatarUrl = (iconUrl?: string | null): string => {
    if (!iconUrl) return DEFAULT_AVATAR;
    return iconUrl.startsWith('http') ? iconUrl : BASE_URL + iconUrl;
  };

  const sentRequestIds = new Set(sentRequests.map((u) => u.id));
  const filteredSearchResults = searchResults.filter((u) => !sentRequestIds.has(u.id));

  return (
    <Box>
      <AppBar />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Tabs value={currentTab} onChange={handleChangeTab} centered>
          <Tab label="Твои друзья" />
          <Tab label="Найти друга" />
          <Tab label="Запросы" />
        </Tabs>

        {/* Вкладка: Твои друзья */}
        {currentTab === 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Твои друзья
            </Typography>
            <Paper sx={{ p: 2 }}>
              {isLoadingFriends ? (
                <Typography>Загрузка...</Typography>
              ) : friends.length === 0 ? (
                <Typography>У тебя пока нет друзей.</Typography>
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
                        <Avatar src={getAvatarUrl(friend.icon_url)} />
                      </ListItemAvatar>
                      <ListItemText primary={friend.user_name} secondary={friend.email} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>
        )}

        {/* Вкладка: Найти друга */}
        {currentTab === 1 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Найти друга
            </Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Имя пользователя или Email"
                placeholder="Введите имя или почту"
                value={searchQuery}
                onChange={handleSearchQueryChange}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleClickSearch}
                disabled={isSearching}
              >
                {isSearching ? 'Идет поиск...' : 'Поиск'}
              </Button>
            </Paper>

            <Typography variant="h6" gutterBottom>
              Результаты поиска
            </Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
              {isSearching ? (
                <Typography>Загрузка...</Typography>
              ) : filteredSearchResults.length === 0 ? (
                <Typography color="text.secondary">Ничего не найдено.</Typography>
              ) : (
                <List>
                  {filteredSearchResults.map((user) => (
                    <ListItem
                      key={user.id}
                      secondaryAction={
                        <Button variant="outlined" onClick={() => handleSendRequest(user.id)}>
                          Добавить
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar src={getAvatarUrl(user.icon_url)} />
                      </ListItemAvatar>
                      <ListItemText primary={user.user_name} secondary={user.email} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>

            {sentRequests.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Заявки отправлены
                </Typography>
                <Paper sx={{ p: 2 }}>
                  <List>
                    {sentRequests.map((user) => (
                      <ListItem
                        key={user.id}
                        secondaryAction={<Button variant="outlined" disabled>Отправлено</Button>}
                      >
                        <ListItemAvatar>
                          <Avatar src={getAvatarUrl(user.icon_url)} />
                        </ListItemAvatar>
                        <ListItemText primary={user.user_name} secondary={user.email} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </>
            )}
          </Box>
        )}

        {/* Вкладка: Запросы */}
        {currentTab === 2 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Запросы в друзья
            </Typography>
            <Paper sx={{ p: 2 }}>
              {isLoadingRequests ? (
                <Typography>Загрузка...</Typography>
              ) : incomingRequests.length === 0 && sentRequests.length === 0 ? (
                <Typography>Нет новых входящих или исходящих запросов.</Typography>
              ) : (
                <>
                  {sentRequests.length > 0 && (
                    <>
                      <Typography variant="subtitle1">Исходящие</Typography>
                      <List>
                        {sentRequests.map((req) => (
                          <ListItem
                            key={req.id}
                            secondaryAction={<Button variant="outlined" disabled>Отправлено</Button>}
                          >
                            <ListItemAvatar>
                              <Avatar src={getAvatarUrl(req.icon_url)} />
                            </ListItemAvatar>
                            <ListItemText primary={req.user_name} secondary={req.email} />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}

                  {incomingRequests.length > 0 && (
                    <>
                      <Typography variant="subtitle1" sx={{ mt: sentRequests.length > 0 ? 2 : 0 }}>
                        Входящие
                      </Typography>
                      <List>
                        {incomingRequests.map((req) => (
                          <ListItem
                            key={req.id}
                            secondaryAction={
                              <>
                                <Button
                                  variant="contained"
                                  color="success"
                                  sx={{ mr: 1 }}
                                  onClick={() => handleAcceptRequest(req.id)}
                                >
                                  Принять
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleRejectRequest(req.id)}
                                >
                                  Отклонить
                                </Button>
                              </>
                            }
                          >
                            <ListItemAvatar>
                              <Avatar src={getAvatarUrl(req.icon_url)} />
                            </ListItemAvatar>
                            <ListItemText primary={req.user_name} secondary={req.email} />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </>
              )}
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AddFriendsPage;
