document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('reg-username').value;
            const password = document.getElementById('reg-password').value;
            const passwordConfirm = document.getElementById('reg-password-confirm').value;

            try {
                await api.register({ username, password, password_confirm: passwordConfirm });
                window.location.href = 'login.html';
            } catch (error) {
                const errorDiv = document.getElementById('register-error');
                const errorText = document.getElementById('register-error-text');
                errorText.textContent = 'Registration failed. Username may already exist.';
                errorDiv.style.display = 'block';
            }
        });
    }
});