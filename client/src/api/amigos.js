import axios from './axios';

export const addFriendRequest = (email, friendEmail) => axios.post('/addFriend', email, friendEmail);

export const getFriendsRequest = () => axios.get(`/getFriends`);

export const acceptFriendRequest = (friendshipId) => axios.put(`/acceptFriend/${friendshipId}`,);

export const denyFriendRequest = (friendshipId) => axios.delete(`/denyFriend/${friendshipId}`);

export const getYourFriendsRequest = () => axios.get(`/getYourFriends`);