
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

      // Check if email verification is required (explicit flag or no token)
      if (data.requires_verification || (!data.data?.token && data.success)) {
        return {
          success: true,
          message: data.message || "Verification code sent to your email",
          user: data.data,
          requiresVerification: true,
        };
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

      // Fallback: If email verification is required
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
          id: data.data.user?.id || data.data.id,
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
    try {
      return localStorage.getItem("adminAccessToken");
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
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
    let token = this.getAccessToken();
    
    if (!token) {
      // Try to get token again after a small delay (in case it was just stored)
      await new Promise(resolve => setTimeout(resolve, 50));
      token = this.getAccessToken();
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }
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
      if (response.status === 401) {
        // Token expired or invalid, logout
        this.logout();
        throw new Error("Session expired. Please login again.");
      }
      if (response.status === 403) {
        // Permission denied - show the actual error message
        throw new Error(data.message || "Access forbidden. You don't have the required permission.");
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
   * Get all users (employees/learners)
   * @returns {Promise<Object>} Response with users list
   */
  async getAllUsers() {
    return this.authenticatedRequest("/user/all", {
      method: "GET",
    });
  }

  /**
   * Get user details with progress
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Response with user details and progress data
   */
  async getUserDetails(userId) {
    return this.authenticatedRequest(`/user/${userId}`, {
      method: "GET",
    });
  }

  /**
   * Delete user/employee
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Response
   */
  async deleteUser(userId) {
    return this.authenticatedRequest(`/user/${userId}`, {
      method: "DELETE",
    });
  }

  /**
   * Delete admin
   * @param {string} adminId - Admin ID
   * @returns {Promise<Object>} Response
   */
  async deleteAdmin(adminId) {
    return this.authenticatedRequest(`/user/admin/${adminId}`, {
      method: "DELETE",
    });
  }

  /**
   * Get all admins (excluding employees)
   * @returns {Promise<Object>} Response with admins list including role information
   */
  async getAllAdminsWithRoles() {
    try {
      // First, get all users
      const usersResponse = await this.authenticatedRequest("/user/all", {
        method: "GET",
      });
      return usersResponse;
    } catch (error) {
      // If endpoint doesn't exist, try alternative approach
      throw new Error(error.message || "Failed to fetch admins");
    }
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
    return this.authenticatedRequest(`/section/${id}`, {
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
    return this.authenticatedRequest(`/topic/${id}`, {
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

  // ============================================
  // Roles & Permissions API
  // ============================================

  /**
   * Get all roles
   * @returns {Promise<Object>} Response with roles list
   */
  async getAllRoles() {
    return this.authenticatedRequest("/role/all", {
      method: "GET",
    });
  }

  /**
   * Create a new role
   * @param {string} name - Role name
   * @param {string} description - Role description
   * @returns {Promise<Object>} Response with created role
   */
  async createRole(name, description) {
    return this.authenticatedRequest("/role/create", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
  }

  /**
   * Get all permissions
   * @returns {Promise<Object>} Response with permissions list
   */
  async getAllPermissions() {
    return this.authenticatedRequest("/role/permissions/all", {
      method: "GET",
    });
  }

  /**
   * Get all role-permission mappings
   * @returns {Promise<Object>} Response with role-permission mappings
   */
  async getAllRolePermissions() {
    return this.authenticatedRequest("/role/permissions/mappings", {
      method: "GET",
    });
  }

  /**
   * Get permissions for a specific role
   * @param {string} roleId - Role ID
   * @returns {Promise<Object>} Response with role permissions
   */
  async getRolePermissions(roleId) {
    return this.authenticatedRequest(`/role/${roleId}/permissions`, {
      method: "GET",
    });
  }

  /**
   * Add permission to role
   * @param {string} roleId - Role ID
   * @param {string} permissionId - Permission ID
   * @returns {Promise<Object>} Response
   */
  async addPermissionToRole(roleId, permissionId) {
    return this.authenticatedRequest(`/role/${roleId}/permission/${permissionId}`, {
      method: "POST",
    });
  }

  /**
   * Remove permission from role
   * @param {string} roleId - Role ID
   * @param {string} permissionId - Permission ID
   * @returns {Promise<Object>} Response
   */
  async removePermissionFromRole(roleId, permissionId) {
    return this.authenticatedRequest(`/role/${roleId}/permission/${permissionId}`, {
      method: "DELETE",
    });
  }

  /**
   * Create user with role
   * @param {string} full_name - User's full name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} role_id - Role ID to assign
   * @param {string} branch_id - Branch ID (optional)
   * @param {string} department_id - Department ID (optional)
   * @returns {Promise<Object>} Response with created user
   */
  async createUserWithRole(full_name, email, password, role_id, branch_id = null, department_id = null) {
    return this.authenticatedRequest("/user/create", {
      method: "POST",
      body: JSON.stringify({ 
        full_name, 
        email, 
        password, 
        role_id,
        branch_id: branch_id || null,
        department_id: department_id || null,
      }),
    });
  }

  /**
   * Get current user's permissions
   * @returns {Promise<Object>} Response with user permissions
   */
  async getUserPermissions() {
    return this.authenticatedRequest("/user/permissions", {
      method: "GET",
    });
  }

  // ============================================
  // Branch API
  // ============================================

  /**
   * Get all branches
   * @returns {Promise<Object>} Response with branches list
   */
  async getAllBranches() {
    return this.authenticatedRequest("/branch/all", {
      method: "GET",
    });
  }

  /**
   * Create a new branch
   * @param {string} name - Branch name
   * @param {string} description - Branch description
   * @param {string} location - Branch location
   * @returns {Promise<Object>} Response with created branch
   */
  async createBranch(name, description, location) {
    return this.authenticatedRequest("/branch/create", {
      method: "POST",
      body: JSON.stringify({ name, description, location }),
    });
  }

  /**
   * Update a branch
   * @param {string} branchId - Branch ID
   * @param {Object} updates - Branch update data
   * @returns {Promise<Object>} Response with updated branch
   */
  async updateBranch(branchId, updates) {
    return this.authenticatedRequest(`/branch/${branchId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete a branch
   * @param {string} branchId - Branch ID
   * @returns {Promise<Object>} Response
   */
  async deleteBranch(branchId) {
    return this.authenticatedRequest(`/branch/${branchId}`, {
      method: "DELETE",
    });
  }

  // ============================================
  // Department API
  // ============================================

  /**
   * Get all departments
   * @returns {Promise<Object>} Response with departments list
   */
  async getAllDepartments() {
    return this.authenticatedRequest("/department/all", {
      method: "GET",
    });
  }

  /**
   * Create a new department
   * @param {string} name - Department name
   * @param {string} description - Department description
   * @param {string} branchId - Branch ID (optional)
   * @returns {Promise<Object>} Response with created department
   */
  async createDepartment(name, description, branchId = null) {
    return this.authenticatedRequest("/department/create", {
      method: "POST",
      body: JSON.stringify({ name, description, branch_id: branchId }),
    });
  }

  /**
   * Update a department
   * @param {string} departmentId - Department ID
   * @param {Object} updates - Department update data
   * @returns {Promise<Object>} Response with updated department
   */
  async updateDepartment(departmentId, updates) {
    return this.authenticatedRequest(`/department/${departmentId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete a department
   * @param {string} departmentId - Department ID
   * @returns {Promise<Object>} Response
   */
  async deleteDepartment(departmentId) {
    return this.authenticatedRequest(`/department/${departmentId}`, {
      method: "DELETE",
    });
  }

  // ============================================
  // Section API
  // ============================================

  /**
   * Get all sections
   * @returns {Promise<Object>} Response with sections list
   */
  async getAllSections() {
    return this.authenticatedRequest("/section/all", {
      method: "GET",
    });
  }

  /**
   * Create a new section
   * @param {string} section_title - Section title
   * @param {string} section_description - Section description (optional)
   * @param {string} branch_id - Branch ID (optional)
   * @param {string} department_id - Department ID (optional)
   * @returns {Promise<Object>} Response with created section
   */
  async createSection(section_title, section_description = null, branch_id = null, department_id = null) {
    return this.authenticatedRequest("/section/create", {
      method: "POST",
      body: JSON.stringify({ 
        section_title, 
        section_description, 
        branch_id, 
        department_id 
      }),
    });
  }

  // ============================================
  // Topic API
  // ============================================

  /**
   * Get topics by section ID
   * @param {string} section_id - Section ID
   * @returns {Promise<Object>} Response with topics list
   */
  async getTopicsBySection(section_id) {
    return this.authenticatedRequest(`/topic/section/${section_id}`, {
      method: "GET",
    });
  }

  /**
   * Create topic with optional quiz
   * @param {string} topic_title - Topic title
   * @param {string} topic_description - Topic description (optional)
   * @param {string} section_id - Section ID
   * @param {string} video_url - Video URL (optional)
   * @param {string} subtitle_url - Subtitle URL (optional)
   * @param {number} video_duration_seconds - Video duration in seconds (optional)
   * @param {boolean} allow_skip - Allow skip video (optional)
   * @param {Object} quiz - Quiz data (optional)
   * @returns {Promise<Object>} Response with created topic
   */
  async createTopicWithQuiz(topic_title, topic_description = null, section_id, video_url = null, subtitle_url = null, video_duration_seconds = null, allow_skip = false, quiz = null) {
    return this.authenticatedRequest("/topic/create", {
      method: "POST",
      body: JSON.stringify({ 
        topic_title, 
        topic_description, 
        section_id, 
        video_url,
        subtitle_url,
        video_duration_seconds,
        allow_skip,
        quiz 
      }),
    });
  }

  /**
   * Update topic video
   * @param {string} topic_id - Topic ID
   * @param {string} video_url - Video URL (optional)
   * @param {string} subtitle_url - Subtitle URL (optional)
   * @param {number} video_duration_seconds - Video duration in seconds (optional)
   * @param {boolean} allow_skip - Allow skip video (optional)
   * @returns {Promise<Object>} Response with updated topic
   */
  async updateTopicVideo(topic_id, video_url = null, subtitle_url = null, video_duration_seconds = null, allow_skip = false) {
    return this.authenticatedRequest(`/topic/${topic_id}/video`, {
      method: "PUT",
      body: JSON.stringify({ 
        video_url,
        subtitle_url,
        video_duration_seconds,
        allow_skip
      }),
    });
  }

  /**
   * Delete topic video
   * @param {string} topic_id - Topic ID
   * @returns {Promise<Object>} Response with success message
   */
  async deleteTopicVideo(topic_id) {
    return this.authenticatedRequest(`/topic/${topic_id}/video`, {
      method: "DELETE",
    });
  }

  /**
   * Get quiz by topic ID
   * @param {string} topic_id - Topic ID
   * @returns {Promise<Object>} Response with quiz data
   */
  async getQuizByTopic(topic_id) {
    return this.authenticatedRequest(`/topic/${topic_id}/quiz`, {
      method: "GET",
    });
  }

  /**
   * Update quiz by topic ID
   * @param {string} topic_id - Topic ID
   * @param {Object} quizData - Quiz data (instructions, type, time_limit, passing_required, passing_score, questions)
   * @returns {Promise<Object>} Response with updated quiz data
   */
  async updateQuizByTopic(topic_id, quizData) {
    return this.authenticatedRequest(`/topic/${topic_id}/quiz`, {
      method: "PUT",
      body: JSON.stringify(quizData),
    });
  }

  /**
   * Delete topic
   * @param {string} topic_id - Topic ID
   * @returns {Promise<Object>} Response with success message
   */
  async deleteTopic(topic_id) {
    return this.authenticatedRequest(`/topic/${topic_id}`, {
      method: "DELETE",
    });
  }

  /**
   * Get current user profile (me)
   * @returns {Promise<Object>} Response with current user data (full_name, email, role, permissions, branch, department, etc.)
   */
  async getCurrentUser() {
    return this.authenticatedRequest("/user/me", {
      method: "GET",
    });
  }

  /**
   * Update current user profile
   * @param {Object} profileData - Profile data to update (e.g., { full_name: "New Name" })
   * @returns {Promise<Object>} Response with updated user data
   */
  async updateProfile(profileData) {
    return this.authenticatedRequest("/user/me", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @param {string} confirmPassword - Confirm new password
   * @returns {Promise<Object>} Response with success message
   */
  async changePassword(currentPassword, newPassword, confirmPassword) {
    return this.authenticatedRequest("/user/change-password", {
      method: "PUT",
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });
  }
}

export default new AdminAPI();
