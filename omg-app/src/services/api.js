import axios from 'axios';

const API_BASE_URL = 'https://localhost:8090/api';

/**
 * Axios instance configured with base URL and default headers for API requests.
 * Automatically includes authentication token from localStorage if available.
 * Access: Import { api } from './services/api.js' and use api.get(), api.post(), etc.
 * @type {import('axios').AxiosInstance}
 */
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // Add any required authentication headers here
    },
});

/**
 * Request interceptor to add authorization token to outgoing requests.
 * Retrieves token from localStorage and adds it to the Authorization header.
 * Functionality: Ensures authenticated requests by attaching Bearer token.
 * Prototype: (config) => config | Promise.reject(error)
 * Access: Automatically applied to all requests made via the 'api' instance.
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); // Adjust as needed for your auth implementation
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    } return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * Object containing API service methods for authentication and user management.
 * Provides high-level functions for login, registration, profile management, etc.
 * Access: Import { apiServices } from './services/api.js' and call apiServices.methodName()
 * @type {Object}
 */
export const apiServices = {
    /**
     * Saves authentication data (tokens and roles) to localStorage.
     * Functionality: Stores auth tokens and user roles for session persistence.
     * Prototype: (tokens: any, roles: string[]) => void
     * Access: apiServices.saveAuthData(tokens, roles)
     * @param {any} tokens - Authentication tokens object
     * @param {string[]} roles - Array of user roles
     */
    saveAuthData: (tokens, roles) => { },
    //getAuthData:()=>({tokens:null,roles:[]}),
    //clearAuthData:()=>{},

    /**
     * Logs out the user by removing authentication data from localStorage.
     * Functionality: Clears auth token and roles, effectively ending the user session.
     * Prototype: () => void
     * Access: apiServices.logout()
     */
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('roles');
    },

    /**
     * Checks if the user has a specific role.
     * Functionality: Verifies role membership by checking stored roles in localStorage.
     * Prototype: (role: string) => boolean
     * Access: apiServices.hasRole('admin')
     * @param {string} role - The role to check for
     * @returns {boolean} True if user has the role, false otherwise
     */
    hasRole: (role) => {
        const roles = JSON.parse(localStorage.getItem('roles') || '[]');
        return Array.isArray(roles) && roles.includes(role);
    },

    /**
     * Checks if the user has admin role.
     * Functionality: Convenience method to check for admin privileges.
     * Prototype: () => boolean
     * Access: apiServices.isAdmin()
     * @returns {boolean} True if user is admin, false otherwise
     */
    isAdmin() { return this.hasRole('admin'); },

    /**
     * Checks if the user has user role.
     * Functionality: Convenience method to check for standard user privileges.
     * Prototype: () => boolean
     * Access: apiServices.isUser()
     * @returns {boolean} True if user has user role, false otherwise
     */
    isUser() { return this.hasRole('user'); },

    /**
     * Checks if the user has customer role.
     * Functionality: Convenience method to check for customer privileges.
     * Prototype: () => boolean
     * Access: apiServices.isCustomer()
     * @returns {boolean} True if user has customer role, false otherwise
     */
    isCustomer() { return this.hasRole('customer'); },

    /**
     * Checks if the user has auditor role.
     * Functionality: Convenience method to check for auditor privileges.
     * Prototype: () => boolean
     * Access: apiServices.isAuditor()
     * @returns {boolean} True if user has auditor role, false otherwise
     */
    isAuditor() { return this.hasRole('auditor'); },

    /**
     * Authenticates a user with email and password.
     * Functionality: Sends login credentials to the server and returns authentication response.
     * Prototype: (body: {email: string, password: string}) => Promise<AxiosResponse>
     * Access: apiServices.login({email: 'user@example.com', password: 'pass'})
     * @param {Object} body - Login credentials
     * @param {string} body.email - User's email address
     * @param {string} body.password - User's password
     * @returns {Promise} Axios response containing auth tokens and user data
     */
    login: (body) => {
        // Implementation for login
        return api.post('/auth/login', body);
    },

    /**
     * Registers a new user account.
     * Functionality: Sends user registration data to the server to create a new account.
     * Prototype: (body: {email: string, password: string, ...}) => Promise<AxiosResponse>
     * Access: apiServices.register({email: 'user@example.com', password: 'pass', name: 'User'})
     * @param {Object} body - User registration data
     * @returns {Promise} Axios response confirming registration
     */
    register: (body) => {
        // Implementation for registration
        return api.post('/auth/register', body);
    },

    /**
     * Initiates password reset process.
     * Functionality: Sends a password reset request to the server with user's email.
     * Prototype: (body: {email: string}) => Promise<AxiosResponse>
     * Access: apiServices.forgetPassword({email: 'user@example.com'})
     * @param {Object} body - Password reset request data
     * @param {string} body.email - User's email address
     * @returns {Promise} Axios response confirming reset email sent
     */
    forgetPassword: (body) => {
        // Implementation for forget password
        return api.post('/auth/forget-password', body);
    },

    /**
     * Resets user password using reset token.
     * Functionality: Sends new password with reset token to complete password reset.
     * Prototype: (body: {token: string, newPassword: string}) => Promise<AxiosResponse>
     * Access: apiServices.resetPassword({token: 'reset-token', newPassword: 'newpass'})
     * @param {Object} body - Password reset data
     * @param {string} body.token - Password reset token
     * @param {string} body.newPassword - New password
     * @returns {Promise} Axios response confirming password reset
     */

    resetPassword: (body) => {
        // Implementation for reset password
        return api.post('/auth/reset-password', body);
    },

    /**
     * Fetches the current user's profile information.
     * Functionality: Retrieves user profile data from the server.
     * Prototype: () => Promise<AxiosResponse>
     * Access: apiServices.getUserProfile()
     * @returns {Promise} Axios response containing user profile data
     */

    getUserProfile: () => {
        // Implementation for fetching user profile
        return api.get('/user/profile');
    },

    /**
     * Updates the user's password.
     * Functionality: Changes the user's password by providing old and new passwords.
     * Prototype: ({oldPassword: string, newPassword: string}) => Promise<AxiosResponse>
     * Access: apiServices.updatePassword({oldPassword: 'oldpass', newPassword: 'newpass'})
     * @param {Object} params - Password update data
     * @param {string} params.oldPassword - Current password
     * @param {string} params.newPassword - New password
     * @returns {Promise} Axios response confirming password update
     */

    updatePassword: ({ oldPassword, newPassword }) => {
        // Implementation for updating password
        return api.put('/user/update-password', {
            oldPassword,
            newPassword
        });
    },

    // Add more API methods as needed   


};
