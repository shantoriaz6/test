import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1/tweets';

export const getTweets = async ({ page = 1, limit = 10 } = {}) => {
	const res = await axios.get(BASE_URL, {
		params: { page, limit },
		withCredentials: true,
	});
	if (res.data?.statusCode !== 200) {
		throw new Error(res.data?.message || 'Failed to fetch tweets');
	}
	return res.data.data;
};

export const createTweet = async (content) => {
	const res = await axios.post(
		BASE_URL,
		{ content },
		{ withCredentials: true, headers: { 'Content-Type': 'application/json' } }
	);
	if (![200, 201].includes(res.data?.statusCode)) {
		throw new Error(res.data?.message || 'Failed to create tweet');
	}
	return res.data.data;
};

export const updateTweet = async (tweetId, content) => {
	const res = await axios.patch(
		`${BASE_URL}/${tweetId}`,
		{ content },
		{ withCredentials: true, headers: { 'Content-Type': 'application/json' } }
	);
	if (res.data?.statusCode !== 200) {
		throw new Error(res.data?.message || 'Failed to update tweet');
	}
	return res.data.data;
};

export const deleteTweet = async (tweetId) => {
	const res = await axios.delete(`${BASE_URL}/${tweetId}`, {
		withCredentials: true,
	});
	if (res.data?.statusCode !== 200) {
		throw new Error(res.data?.message || 'Failed to delete tweet');
	}
	return true;
};

