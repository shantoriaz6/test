import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const toggleVideoLike = async (videoId) => {
  const response = await axios.post(
    `${API_BASE_URL}/likes/toggle/v/${videoId}`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const toggleCommentLike = async (commentId) => {
  const response = await axios.post(
    `${API_BASE_URL}/likes/toggle/c/${commentId}`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const getLikedVideos = async () => {
  const response = await axios.get(`${API_BASE_URL}/likes/videos`, {
    withCredentials: true
  });
  return response.data;
};
