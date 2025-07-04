/**
 * API service for journal backend communication.
 * Uses Clerk for user authentication; for all protected routes, 
 * retrieves JWT from Clerk and sends it as a Bearer token.
 */

/**
 * Clerk JWT integration for Authorization headers.
 * Note: You must get the JWT inside a React component with Clerk's `useAuth`.
 * Pass the JWT explicitly to any protected API calls below.
 *
 * Example usage in component:
 *   const { getToken } = useAuth();
 *   const jwt = await getToken({ template: "jwt" });
 *   await apiService.getAllEntries(jwt)
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // PUBLIC_INTERFACE
  /**
   * Core request method. For protected routes, 
   * pass a Clerk JWT in the jwt argument (string).
   */
  async request(endpoint, options = {}, jwt) {
    const url = `${this.baseUrl}${endpoint}`;

    let headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (jwt) {
      headers = {
        ...headers,
        'Authorization': `Bearer ${jwt}`,
      };
    }

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
  async getAllEntries(jwt) {
    return this.request('/entries', {}, jwt);
  }

  // PUBLIC_INTERFACE
  async getEntry(id, jwt) {
    return this.request(`/entries/${id}`, {}, jwt);
  }

  // PUBLIC_INTERFACE
  async createEntry(entryData, jwt) {
    return this.request('/entries', {
      method: 'POST',
      body: JSON.stringify(entryData),
    }, jwt);
  }

  // PUBLIC_INTERFACE
  async updateEntry(id, entryData, jwt) {
    return this.request(`/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entryData),
    }, jwt);
  }

  // PUBLIC_INTERFACE
  async deleteEntry(id, jwt) {
    return this.request(`/entries/${id}`, {
      method: 'DELETE',
    }, jwt);
  }

  // PUBLIC_INTERFACE
  async getEntriesByMood(mood, jwt) {
    return this.request(`/entries?mood=${encodeURIComponent(mood)}`, {}, jwt);
  }

  // PUBLIC_INTERFACE
  async getEntriesByDateRange(startDate, endDate, jwt) {
    return this.request(`/entries?start_date=${startDate}&end_date=${endDate}`, {}, jwt);
  }
}

// Export a singleton instance
const apiService = new ApiService();
export default apiService;
