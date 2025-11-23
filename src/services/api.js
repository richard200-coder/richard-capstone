const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AuthAPI {
  constructor() {
    this.baseURL = `${API_BASE_URL}/auth`;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    return fetch(url, config);
  }

  async register(name, email, password, role = 'student') {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async login(email, password) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/logout', {
      method: 'POST',
    });
  }

  async getMe() {
    return this.request('/me', {
      method: 'GET',
    });
  }

  async updateMe(profile) {
    return this.request('/me', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  async getAllUsers() {
    return this.request('/users', {
      method: 'GET',
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }
}

class SMSAPI {
  constructor() {
    this.baseURL = `${API_BASE_URL}/sms`;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    return fetch(url, config);
  }

  async sendProgressReport(studentId, progressData) {
    return this.request('/progress-report', {
      method: 'POST',
      body: JSON.stringify({ studentId, progressData }),
    });
  }

  async sendWeeklySummary(studentId, weekStart, weekEnd) {
    return this.request('/weekly-summary', {
      method: 'POST',
      body: JSON.stringify({ studentId, weekStart, weekEnd }),
    });
  }

  async sendTestSMS(phoneNumber, message) {
    return this.request('/test', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, message }),
    });
  }

  async updateSMSSettings(userId, settings) {
    return this.request(`/settings/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getSMSSettings(userId) {
    return this.request(`/settings/${userId}`, {
      method: 'GET',
    });
  }
}

class QuizAPI {
  constructor() {
    this.baseURL = `${API_BASE_URL}/quizzes`;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };
    return fetch(url, config);
  }

  async getQuizzes() {
    return this.request('/', { method: 'GET' });
  }

  async createQuiz(quiz) {
    return this.request('/', {
      method: 'POST',
      body: JSON.stringify(quiz),
    });
  }

  async updateQuiz(quizId, quiz) {
    return this.request(`/${quizId}`, {
      method: 'PUT',
      body: JSON.stringify(quiz),
    });
  }

  async deleteQuiz(quizId) {
    return this.request(`/${quizId}`, {
      method: 'DELETE',
    });
  }
}

export const authAPI = new AuthAPI();
export const smsAPI = new SMSAPI();
export const quizAPI = new QuizAPI();
