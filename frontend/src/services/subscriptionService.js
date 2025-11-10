import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1/subscriptions';

export const toggleSubscription = async (channelId) => {
	const res = await axios.post(
		`${BASE_URL}/c/${channelId}`,
		{},
		{ withCredentials: true }
	);
	// ApiResponse with message and null data
	return res.data;
};

export const getSubscribedChannels = async (subscriberId) => {
	const res = await axios.get(`${BASE_URL}/u/${subscriberId}`, {
		withCredentials: true,
	});
	return res.data?.data || [];
};

export const getChannelSubscribers = async (channelId) => {
	const res = await axios.get(`${BASE_URL}/subscribers/${channelId}`, {
		withCredentials: true,
	});
	return res.data?.data || [];
};

export default {
	toggleSubscription,
	getSubscribedChannels,
	getChannelSubscribers,
};

