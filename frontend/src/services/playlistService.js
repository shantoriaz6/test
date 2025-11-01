import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1/playlists';

// Create a new playlist
export const createPlaylist = async ({ name, description }) => {
  const response = await axios.post(
    BASE_URL,
    { name, description },
    {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    }
  );
  if (response.data?.statusCode !== 200) {
    throw new Error(response.data?.message || 'Failed to create playlist');
  }
  return response.data.data;
};

// Get all playlists for a user
export const getUserPlaylists = async (userId) => {
  const response = await axios.get(
    `${BASE_URL}/user/${userId}`,
    { withCredentials: true }
  );
  if (response.data?.statusCode !== 200) {
    throw new Error(response.data?.message || 'Failed to fetch playlists');
  }
  return response.data.data;
};

// Get playlist by ID
export const getPlaylistById = async (playlistId) => {
  const response = await axios.get(
    `${BASE_URL}/${playlistId}`,
    { withCredentials: true }
  );
  if (response.data?.statusCode !== 200) {
    throw new Error(response.data?.message || 'Failed to fetch playlist');
  }
  return response.data.data;
};

// Update playlist (name and/or description)
export const updatePlaylist = async (playlistId, { name, description }) => {
  const response = await axios.patch(
    `${BASE_URL}/${playlistId}`,
    { name, description },
    {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    }
  );
  if (response.data?.statusCode !== 200) {
    throw new Error(response.data?.message || 'Failed to update playlist');
  }
  return response.data.data;
};

// Delete playlist
export const deletePlaylist = async (playlistId) => {
  const response = await axios.delete(
    `${BASE_URL}/${playlistId}`,
    { withCredentials: true }
  );
  if (response.data?.statusCode !== 200) {
    throw new Error(response.data?.message || 'Failed to delete playlist');
  }
  return response.data;
};

// Add video to playlist
export const addVideoToPlaylist = async (videoId, playlistId) => {
  const response = await axios.patch(
    `${BASE_URL}/add/${videoId}/${playlistId}`,
    {},
    { withCredentials: true }
  );
  if (response.data?.statusCode !== 200) {
    throw new Error(response.data?.message || 'Failed to add video to playlist');
  }
  return response.data.data;
};

// Remove video from playlist
export const removeVideoFromPlaylist = async (videoId, playlistId) => {
  const response = await axios.patch(
    `${BASE_URL}/remove/${videoId}/${playlistId}`,
    {},
    { withCredentials: true }
  );
  if (response.data?.statusCode !== 200) {
    throw new Error(response.data?.message || 'Failed to remove video from playlist');
  }
  return response.data.data;
};

