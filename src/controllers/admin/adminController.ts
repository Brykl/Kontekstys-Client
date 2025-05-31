import axios from "axios";
const server_url = import.meta.env.VITE_SERVER_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllUsers = async () => {
  const res = await axios.get(`${server_url}/api/admin/users`, getAuthHeader());
  return res.data.users;
};

export const deleteUser = async (userId: number) => {
  await axios.delete(`${server_url}/api/admin/users/${userId}`, getAuthHeader());
};

export const toggleBlockUser = async (userId: number, isActive: boolean) => {
  const path = isActive ? "block" : "unblock";
  await axios.patch(`${server_url}/api/admin/users/${userId}/${path}`, null, getAuthHeader());
};
