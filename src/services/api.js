
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


class AdminAPI {
  /**
   * Admin login
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<Object>} Response with user data and token (if email verified) or verification required
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // If login successful and token is provided (email already verified)
      if (data.success && data.data?.token) {
        // Store token and user data
        localStorage.setItem("adminAccessToken", data.data.token);
        localStorage.setItem("adminData", JSON.stringify(data.data));
        
        return {
          success: true,
          message: data.message || "Login successful",
          token: data.data.token,
          user: data.data,
          requiresVerification: false,
        };
      }

      // If email verification is required
      return {
        success: true,
        message: data.message || "Verification code sent to your email",
        user: data.data,
        requiresVerification: true,
      };
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  }

  /**
   * Verify login code and complete authentication
   * @param {string} email - Admin email
   * @param {string} code - Verification code (6 digits)
   * @returns {Promise<Object>} Response with token and user data
   */
  async verifyLoginCode(email, code) {
    try {
      // Validate code format
      if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
        throw new Error("Please enter a valid 6-digit verification code");
      }

      const response = await fetch(`${API_BASE_URL}/user/verify-email-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          email_verification_code: code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      // Store token and user data
      if (data.success && data.data?.token) {
        localStorage.setItem("adminAccessToken", data.data.token);
        localStorage.setItem("adminData", JSON.stringify({
          email: data.data.email,
        }));

        return {
          success: true,
          message: data.message || "Email verified successfully",
          token: data.data.token,
          user: data.data,
        };
      }

      throw new Error("Invalid response from server");
    } catch (error) {
      throw new Error(error.message || "Verification failed");
    }
  }

  /**
   * Get stored access token
   * @returns {string|null} Access token
   */
  getAccessToken() {
    return localStorage.getItem("adminAccessToken");
  }

  /**
   * Get stored refresh token
   * @returns {string|null} Refresh token
   */
  getRefreshToken() {
    return localStorage.getItem("adminRefreshToken");
  }

  /**
   * Get stored admin data
   * @returns {Object|null} Admin data
   */
  getAdminData() {
    const adminData = localStorage.getItem("adminData");
    return adminData ? JSON.parse(adminData) : null;
  }

  /**
   * Check if admin is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return !!this.getAccessToken();
  }

  /**
   * Logout admin
   */
  logout() {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminData");
  }

  /**
   * Make authenticated API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async authenticatedRequest(endpoint, options = {}) {
    const token = this.getAccessToken();
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid, logout
        this.logout();
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  /**
   * Get all admins (Superadmin only)
   * @returns {Promise<Object>} Response with admins list
   */
  async getAllAdmins() {
    return this.authenticatedRequest("/admin/manage", {
      method: "GET",
    });
  }

  /**
   * Create a new admin (Superadmin only)
   * @param {string} name - Admin full name
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<Object>} Response with created admin data
   */
  async createAdmin(name, email, password) {
    return this.authenticatedRequest("/admin/manage", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
  }

  /**
   * Update admin (Superadmin only)
   * @param {number} id - Admin ID
   * @param {Object} updates - Admin update data
   * @returns {Promise<Object>} Response with updated admin data
   */
  async updateAdmin(id, updates) {
    return this.authenticatedRequest(`/admin/manage/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete admin (Superadmin only)
   * @param {number} id - Admin ID
   * @returns {Promise<Object>} Response
   */
  async deleteAdmin(id) {
    return this.authenticatedRequest(`/admin/manage/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Get all users (Superadmin only)
   * @returns {Promise<Object>} Response with users list
   */
  async getAllUsers() {
    return this.authenticatedRequest("/admin/users", {
      method: "GET",
    });
  }

  /**
   * Get user by ID (Superadmin only)
   * @param {number} id - User ID
   * @returns {Promise<Object>} Response with user data
   */
  async getUserById(id) {
    return this.authenticatedRequest(`/admin/users/${id}`, {
      method: "GET",
    });
  }

  // ============================================
  // Sections API
  // ============================================

  /**
   * Get all sections
   * @param {boolean} includeTopics - Include topics in response
   * @returns {Promise<Object>} Response with sections list
   */
  async getAllSections(includeTopics = false) {
    const queryParam = includeTopics ? "?includeTopics=true" : "";
    return this.authenticatedRequest(`/admin/sections${queryParam}`, {
      method: "GET",
    });
  }

  /**
   * Get section by ID
   * @param {number} id - Section ID
   * @param {boolean} includeTopics - Include topics in response
   * @returns {Promise<Object>} Response with section data
   */
  async getSectionById(id, includeTopics = false) {
    const queryParam = includeTopics ? "?includeTopics=true" : "";
    return this.authenticatedRequest(`/admin/sections/${id}${queryParam}`, {
      method: "GET",
    });
  }

  /**
   * Create a new section
   * @param {string} title - Section title
   * @param {string} description - Section description
   * @param {number} order - Section order
   * @returns {Promise<Object>} Response with created section
   */
  async createSection(title, description, order) {
    return this.authenticatedRequest("/admin/sections", {
      method: "POST",
      body: JSON.stringify({ title, description, order }),
    });
  }

  /**
   * Update section
   * @param {number} id - Section ID
   * @param {Object} updates - Section update data
   * @returns {Promise<Object>} Response with updated section
   */
  async updateSection(id, updates) {
    return this.authenticatedRequest(`/admin/sections/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete section
   * @param {number} id - Section ID
   * @returns {Promise<Object>} Response
   */
  async deleteSection(id) {
    return this.authenticatedRequest(`/admin/sections/${id}`, {
      method: "DELETE",
    });
  }

  // ============================================
  // Topics API
  // ============================================

  /**
   * Get all topics
   * @param {number|null} sectionId - Filter by section ID
   * @returns {Promise<Object>} Response with topics list
   */
  async getAllTopics(sectionId = null) {
    const queryParam = sectionId ? `?sectionId=${sectionId}` : "";
    return this.authenticatedRequest(`/admin/topics${queryParam}`, {
      method: "GET",
    });
  }

  /**
   * Get topic by ID
   * @param {number} id - Topic ID
   * @param {boolean} includeSection - Include section in response
   * @returns {Promise<Object>} Response with topic data
   */
  async getTopicById(id, includeSection = false) {
    const queryParam = includeSection ? "?includeSection=true" : "";
    return this.authenticatedRequest(`/admin/topics/${id}${queryParam}`, {
      method: "GET",
    });
  }

  /**
   * Create a new topic
   * @param {number} sectionId - Section ID
   * @param {string} title - Topic title
   * @param {string} videoUrl - Video URL (optional)
   * @param {boolean} locked - Locked status (optional)
   * @returns {Promise<Object>} Response with created topic
   */
  async createTopic(sectionId, title, videoUrl = null, locked = false) {
    return this.authenticatedRequest("/admin/topics", {
      method: "POST",
      body: JSON.stringify({ sectionId, title, videoUrl, locked }),
    });
  }

  /**
   * Update topic
   * @param {number} id - Topic ID
   * @param {Object} updates - Topic update data
   * @returns {Promise<Object>} Response with updated topic
   */
  async updateTopic(id, updates) {
    return this.authenticatedRequest(`/admin/topics/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete topic
   * @param {number} id - Topic ID
   * @returns {Promise<Object>} Response
   */
  async deleteTopic(id) {
    return this.authenticatedRequest(`/admin/topics/${id}`, {
      method: "DELETE",
    });
  }

  // ============================================
  // Quiz API
  // ============================================

  /**
   * Get quiz for a topic
   * @param {number} topicId - Topic ID
   * @returns {Promise<Object>} Response with quiz data
   */
  async getQuizForTopic(topicId) {
    return this.authenticatedRequest(`/admin/quiz/topic/${topicId}`, {
      method: "GET",
    });
  }

  /**
   * Check if topic has quiz (returns null if no quiz)
   * @param {number} topicId - Topic ID
   * @returns {Promise<Object|null>} Quiz data or null
   */
  async checkTopicHasQuiz(topicId) {
    try {
      const response = await this.getQuizForTopic(topicId);
      return response.data;
    } catch (error) {
      // If 404, topic has no quiz
      return null;
    }
  }
}

export default new AdminAPI();
