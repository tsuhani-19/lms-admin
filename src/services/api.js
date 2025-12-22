
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


class AdminAPI {
  /**
   * Admin login - tries superadmin first, then regular admin
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<Object>} Response with tokens and admin data
   */
  async login(email, password) {
    try {
      // First try superadmin login (ENV-based)
      try {
        const superadminResponse = await fetch(`${API_BASE_URL}/admin/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const superadminData = await superadminResponse.json();

        if (superadminResponse.ok && superadminData.success) {
          // Superadmin login successful
          if (superadminData.accessToken) {
            localStorage.setItem("adminAccessToken", superadminData.accessToken);
          }
          if (superadminData.refreshToken) {
            localStorage.setItem("adminRefreshToken", superadminData.refreshToken);
          }
          if (superadminData.admin) {
            localStorage.setItem("adminData", JSON.stringify(superadminData.admin));
          }
          return superadminData;
        }
      } catch (superadminError) {
        // Superadmin login failed, try regular admin login
      }

      // Try regular admin login (DB-based)
      const adminResponse = await fetch(`${API_BASE_URL}/admin/login-db`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const adminData = await adminResponse.json();

      if (!adminResponse.ok) {
        throw new Error(adminData.message || "Invalid email or password");
      }

      // Regular admin login successful
      if (adminData.accessToken) {
        localStorage.setItem("adminAccessToken", adminData.accessToken);
      }
      if (adminData.refreshToken) {
        localStorage.setItem("adminRefreshToken", adminData.refreshToken);
      }
      if (adminData.admin) {
        localStorage.setItem("adminData", JSON.stringify(adminData.admin));
      }

      return adminData;
    } catch (error) {
      throw error;
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
