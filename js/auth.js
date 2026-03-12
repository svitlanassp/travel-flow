const Auth = {
    setToken(token) {
        localStorage.setItem('accessToken', token);
    },

    getToken() {
        return localStorage.getItem('accessToken');
    },

    logout() {
        localStorage.removeItem('accessToken');
        window.location.href = 'login.html';
    },

    isLoggedIn() {
        return !!this.getToken();
    },
};