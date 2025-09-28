// CSRF token utility functions
export const getCSRFToken = () => {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        return token.content;
    } else {
        console.error('CSRF token not found in DOM');
        return null;
    }
};

export const setupCSRFToken = () => {
    const token = getCSRFToken();
    if (token) {
        // Set default headers for axios
        if (window.axios) {
            window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
            window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            window.axios.defaults.headers.common['Accept'] = 'application/json';
        }
        return token;
    } else {
        console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
        return null;
    }
};

// Function to refresh CSRF token from server
export const refreshCSRFToken = async () => {
    try {
        console.log('Refreshing CSRF token from server...');

        // Get fresh token from server
        const response = await fetch('/sanctum/csrf-cookie', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const newToken = data.token;

            if (newToken) {
                // Update the meta tag with the new token
                let metaTag = document.head.querySelector('meta[name="csrf-token"]');
                if (!metaTag) {
                    metaTag = document.createElement('meta');
                    metaTag.name = 'csrf-token';
                    document.head.appendChild(metaTag);
                }
                metaTag.content = newToken;

                // Update axios headers
                if (window.axios) {
                    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken;
                }

                console.log('CSRF token refreshed successfully:', newToken);
                return newToken;
            }
        }
    } catch (error) {
        console.error('Failed to refresh CSRF token:', error);
    }
    return null;
};

// Axios interceptor to handle CSRF token refresh
export const setupCSRFInterceptor = (axiosInstance) => {
    // Request interceptor to ensure CSRF token is always fresh
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = getCSRFToken();
            if (token) {
                config.headers['X-CSRF-TOKEN'] = token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor to handle CSRF token mismatch
    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response?.status === 419) {
                // CSRF token mismatch - log it but let the component handle it
                console.warn('CSRF token mismatch detected. Component should handle this.');
            }
            return Promise.reject(error);
        }
    );
};
