const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function request(endpoint, options = {}) {
    const token = Auth.getToken();
    const headers = {};

    if (!options.isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const { isFormData: _isFormData, ...fetchOptions } = options;

    const config = {
        ...fetchOptions,
        headers: { ...headers, ...fetchOptions.headers },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
        Auth.logout();
        return null;
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
    }

    if (response.status === 204) return true;

    return response.json();
}

const api = {
    login: (credentials) => request('/login/', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    getTrips: () => request('/trips/'),
    createTrip: (data) => request('/trips/', {
        method: 'POST',
        body: data,
        isFormData: true,
    }),
    updateTrip: (id, data) => request(`/trips/${id}/`, {
        method: 'PUT',
        body: data,
        isFormData: true,
    }),
    deleteTrip: (id) => request(`/trips/${id}/`, {
        method: 'DELETE',
    }),
    register: (data) => request('/register/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};
