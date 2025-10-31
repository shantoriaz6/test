import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const getComments = async (videoId, page = 1, limit = 10) => {
  const response = await axios.get(`${API_BASE_URL}/comments/${videoId}`, {
    params: { page, limit },
    withCredentials: true
  });
  return response.data;
};

export const addComment = async (videoId, content) => {
  const response = await axios.post(
    `${API_BASE_URL}/comments/${videoId}`,
    { content },
    { withCredentials: true }
  );
  return response.data;
};

export const updateComment = async (commentId, content) => {
  const response = await axios.patch(
    `${API_BASE_URL}/comments/${commentId}`,
    { content },
    { withCredentials: true }
  );
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
    withCredentials: true
  });
  return response.data;
};
