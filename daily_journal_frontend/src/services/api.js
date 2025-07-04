/**
 * API service for journal backend communication.
 * Note: Clerk handles authentication; frontend will not set JWT or Authorization header.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // PUBLIC_INTERFACE
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    // No Authorization header here; Clerk handles auth now.
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Try to parse error message from backend
        let message = `HTTP error! status: ${response.status}`;
        try {
          const err = await response.json();
          message = err?.detail || message;
        } catch (_) { /* ignore json parse error */ }
        throw new Error(message);
      }

      // Handle empty responses (e.g., DELETE requests)
      if (response.status === 204) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // PUBLIC_INTERFACE
  async getAllEntries() {
    return this.request('/entries');
  }

  // PUBLIC_INTERFACE
  async getEntry(id) {
    return this.request(`/entries/${id}`);
  }

  // PUBLIC_INTERFACE
  async createEntry(entryData) {
    return this.request('/entries', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  // PUBLIC_INTERFACE
  async updateEntry(id, entryData) {
    return this.request(`/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entryData),
    });
  }

  // PUBLIC_INTERFACE
  async deleteEntry(id) {
    return this.request(`/entries/${id}`, {
      method: 'DELETE',
    });
  }

  // PUBLIC_INTERFACE
  async getEntriesByMood(mood) {
    return this.request(`/entries?mood=${encodeURIComponent(mood)}`);
  }

  // PUBLIC_INTERFACE
  async getEntriesByDateRange(startDate, endDate) {
    return this.request(`/entries?start_date=${startDate}&end_date=${endDate}`);
  }
}

// Export a singleton instance
const apiService = new ApiService();
export default apiService;
