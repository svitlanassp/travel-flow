document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const data = await api.login({ username, password });
                if (data && data.access) {
                    Auth.setToken(data.access);
                    if (Auth.getToken()) {
                        window.location.href = 'index.html';
                    }
                }
            } catch (error) {
                const errorDiv = document.getElementById('login-error');
                errorDiv.style.display = 'block';
            }
        });
    }
});
