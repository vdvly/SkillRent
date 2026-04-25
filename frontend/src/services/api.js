import axios from '../utils/axios';

// Auth API
export const authAPI = {
  register: (email, password, name) =>
    axios.post('/auth/register', { email, password, name }),
  login: (email, password) =>
    axios.post('/auth/login', { email, password }),
  getProfile: () =>
    axios.get('/auth/me'),
};

// Users API
export const usersAPI = {
  getAllUsers: (skip = 0, take = 10) =>
    axios.get(`/users?skip=${skip}&take=${take}`),
  getUserById: (id) =>
    axios.get(`/users/${id}`),
  updateProfile: (data) =>
    axios.put('/users/profile', data),
};

// Services API
export const servicesAPI = {
  getAllServices: (skip = 0, take = 20) =>
    axios.get(`/services?skip=${skip}&take=${take}`),
  getServiceById: (id) =>
    axios.get(`/services/${id}`),
  createService: (data) =>
    axios.post('/services', data),
  updateService: (id, data) =>
    axios.put(`/services/${id}`, data),
  deleteService: (id) =>
    axios.delete(`/services/${id}`),
  getServicesByOwner: (ownerId) =>
    axios.get(`/services/owner/${ownerId}`),
};

// Requests API
export const requestsAPI = {
  getAllRequests: (skip = 0, take = 20) =>
    axios.get(`/requests?skip=${skip}&take=${take}`),
  getRequestById: (id) =>
    axios.get(`/requests/${id}`),
  createRequest: (data) =>
    axios.post('/requests', data),
  updateRequest: (id, data) =>
    axios.put(`/requests/${id}`, data),
  deleteRequest: (id) =>
    axios.delete(`/requests/${id}`),
  getRequestsByRequester: (requesterId) =>
    axios.get(`/requests/requester/${requesterId}`),
};

// Messages API
export const messagesAPI = {
  sendMessage: (content, receiverId) =>
    axios.post('/messages', { content, receiverId }),
  getConversation: (userId, skip = 0) =>
    axios.get(`/messages/conversation/${userId}?skip=${skip}`),
  getReceivedMessages: (skip = 0) =>
    axios.get(`/messages/received?skip=${skip}`),
  markAsRead: (id) =>
    axios.post(`/messages/${id}/read`),
};

// Reviews API
export const reviewsAPI = {
  createReview: (rating, reviewedUserId, comment = '') =>
    axios.post('/reviews', { rating, reviewedUserId, comment }),
  getReviewsForUser: (userId, skip = 0) =>
    axios.get(`/reviews/${userId}?skip=${skip}`),
};
