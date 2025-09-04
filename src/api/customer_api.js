// savi_sri/src/api/customer_api.js
// Centralized API utility for making authenticated requests
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; // Use environment variable for API URL

const makeRequest = async (method, path, data = null, isAuth = true, isFormData = false) => {
    const token = localStorage.getItem('token');
    const headers = {};

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (isAuth && token) {
        headers['x-auth-token'] = token;
    }

    const config = {
        method,
        headers,
        body: isFormData ? data : (data ? JSON.stringify(data) : null),
    };

    try {
        const response = await fetch(`${API_URL}${path}`, config);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.msg || responseData.errors?.[0]?.msg || 'Something went wrong');
        }

        return responseData;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

export const authApi = {
    // Endpoints for customer registration, login, and OTP verification
    checkUser: (email) => makeRequest('POST', '/auth/check-user', { email }, false),
    register: (userData) => makeRequest('POST', '/auth/register', userData, false),
    verifyOtp: (otpData) => makeRequest('POST', '/auth/verify-otp', otpData, false),
    login: (credentials) => makeRequest('POST', '/auth/login', credentials, false),
    // Potentially get customer user data if needed for a profile page (requires auth)
    getUser: () => makeRequest('GET', '/auth/user', null, true),
    updateUser: (userData) => makeRequest('PUT', '/auth/user', userData, true),
};

export const categoryApi = {
    // Endpoints for fetching categories (e.g., for navigation menus, category pages)
    getAll: () => makeRequest('GET', '/categories', null, false), // Public access
    getById: (id) => makeRequest('GET', `/categories/${id}`, null, false), // Public access
};

export const productApi = {
    // Endpoints for fetching products (e.g., for product listings, search results, product detail pages)
    getAll: (categoryId = null) => { // Get all products, or filter by category
        let path = '/products';
        if (categoryId) {
            path += `?categoryId=${categoryId}`;
        }
        return makeRequest('GET', path, null, false); // Public access
    },
    getById: (id) => makeRequest('GET', `/products/${id}`, null, false), // Public access for product detail page
    // New endpoint for incrementing views
    incrementView: (productId) => makeRequest('POST', `/products/${productId}/view`, null, false),
};

export const orderApi = {
    placeOrder: (orderData) => makeRequest('POST', '/orders', orderData, true),
    getUserOrders: () => makeRequest('GET', '/orders/myorders', null, true),
    getOrderById: (id) => makeRequest('GET', `/orders/${id}`, null, true),
    createRazorpayOrder: (orderData) => makeRequest('POST', '/payment/order', orderData, true),
    verifyPayment: (paymentData) => makeRequest('POST', '/payment/verify', paymentData, true),
};

export const contactApi = {
    // Endpoint for sending contact messages
    sendMessage: (messageData) => makeRequest('POST', '/contact', messageData, false),
};

export const cartApi = {
    getCart: () => makeRequest('GET', '/cart', null, true),
    addItem: (itemData) => makeRequest('POST', '/cart', itemData, true),
    removeItem: ({ productId, size }) => makeRequest('DELETE', `/cart/${productId}/${size}`, null, true),
    updateItem: (productId, size, updateData) => makeRequest('PUT', `/cart/${productId}/${size}`, updateData, true),
};

export const colorAnalysisApi = {
    analyzeColors: (analysisData) => makeRequest('POST', '/color-analysis', analysisData, true),
    getUserColorProfile: () => makeRequest('GET', '/color-analysis', null, true),
};

export const favoritesApi = {
    getFavorites: () => makeRequest('GET', '/favorites', null, true),
    addToFavorites: (productId) => makeRequest('POST', `/favorites/${productId}`, null, true),
    removeFromFavorites: (productId) => makeRequest('DELETE', `/favorites/${productId}`, null, true),
};

// Alias exports for components expecting 'customer*' names
export const customerProductApi = productApi;
export const customerOrderApi = orderApi;
export const customerCategoryApi = categoryApi;
export const customerContactApi = contactApi;
export const customerCartApi = cartApi;
export const customerColorAnalysisApi = colorAnalysisApi;
export const customerFavoritesApi = favoritesApi;
export const customerAuthApi = authApi;

// Default export for files importing { default as api }
const api = {
    get: (path) => makeRequest('GET', path),
    post: (path, data) => makeRequest('POST', path, data),
    put: (path, data) => makeRequest('PUT', path, data),
    delete: (path) => makeRequest('DELETE', path),
};

export default api;