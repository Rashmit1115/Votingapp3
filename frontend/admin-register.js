const adminRegBtn = document.getElementById('admin-register-form');
const adminLoginBtn = document.getElementById('admin-login-form');

// Registering as an ADMIN
adminRegBtn.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('admin-name').value;
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                role: 'admin'  // Set the role to admin
            })
        });

        const data = await response.json();
        const messageDiv = document.getElementById('admin-register-message');
        
        if (response.ok) {
            messageDiv.textContent = 'Admin registered successfully!';
            messageDiv.style.color = 'green';
        } else {
            messageDiv.textContent = data.msg || 'Failed to register as admin';
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('admin-register-message').textContent = 'Server error';
    }
});

// Logging in as an ADMIN
adminLoginBtn.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-login-email').value;
    const password = document.getElementById('admin-login-password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        const messageDiv = document.getElementById('admin-login-message');
        
        if (data.token) {
            localStorage.setItem('token', data.token);
            messageDiv.textContent = 'Logged in successfully';
            messageDiv.style.color = 'green';
            window.location.href = 'addCandidates.html';  // Redirect on successful login
        } else {
            messageDiv.textContent = data.msg || 'Login failed';
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('admin-login-message').textContent = 'Server error';
    }
});
