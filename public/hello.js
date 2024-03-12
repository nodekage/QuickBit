// frontend.js
let token = '';
let isLoginFormVisible = true;

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    isLoginFormVisible = false;
}

function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    isLoginFormVisible = true;
}

async function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('http://localhost:8400/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error during login. Server response:', errorDetails);
            throw new Error('Invalid credentials');
        }

        const result = await response.json();
        const token = result.token;
        localStorage.setItem('token', token);
        displayResult('Login successful!');
        showUrlSection();

        // Clear the input values
        usernameInput.value = '';
        passwordInput.value = '';
    } catch (error) {
        console.error('Error during login:', error.message);
        displayError('Invalid credentials, Error during login');
    }
}



async function register() {
    const newUsernameInput = document.getElementById('newUsername');
    const newPasswordInput = document.getElementById('newPassword');

    const newUsername = newUsernameInput.value;
    const newPassword = newPasswordInput.value;

    try {
        const response = await fetch('http://localhost:8400/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: newUsername, password: newPassword }),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        displayResult('Registration successful! You can now log in.');
        showLoginForm();

        // Clear the input values
        newUsernameInput.value = '';
        newPasswordInput.value = '';
    } catch (error) {
        console.error('Error during registration:', error.message);
        displayError('Registration failed');
    }
}


async function shortenUrl() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Handle the case when the token is not available
        console.error('Token not available. User may be logged out.');
        return;
    }
    const longUrl = document.getElementById('longUrl').value;
    const customUrl = document.getElementById('customUrl').value;

    try {
        const response = await fetch('http://localhost:8400/api/url/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
            body: JSON.stringify({ originalUrl: longUrl, customUrl: customUrl }),
        });

        if (!response.ok) {
            throw new Error('Failed to shorten URL');
        }

        const result = await response.json();
        displayResult(`Shortened URL: <a href="${result.shortUrl}" target="_blank">${result.shortUrl}</a>`);
        updateHistory();
    } catch (error) {
        console.error('Error during URL shortening:', error.message);
        displayError('Failed to shorten URL');
    }
}


async function updateHistory() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Handle the case when the token is not available
        console.error('Token not available. User may be logged out.');
        return;
    }
    try {
        const response = await fetch('http://localhost:8400/api/url/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch URL history: backend error res');
        }

        const result = await response.json();

        if (Array.isArray(result.history)) {
            displayHistory(result.history);
        } else {
            throw new Error('Invalid response format: history is not an array');
        }

    } catch (error) {
        console.error('Error fetching URL history:', error.message);
        displayError('Failed to fetch URL history');
    }
}  


async function redirect(shortUrl) {
    try {
        const response = await fetch(`http://localhost:8400/api/url/redirect/${shortUrl}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error during redirection. Server response:', errorDetails);
            throw new Error('Failed to redirect');
        }

        const result = await response.json();
        console.log(result.originalUrl)
        window.open(result.originalUrl, '_blank'); // Open the received URL in a new tab
    } catch (error) {
        console.error('Error during redirection:', error.message);
        displayError('Failed to redirect');
    }
}








function displayResult(message) {
    document.getElementById('result').innerHTML = message;
    document.getElementById('result').style.display = 'block';
}

function displayError(message) {
    alert(message);
}

function showUrlSection() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('urlSection').style.display = 'block';
    updateHistory();
}

function displayHistory(urls) {
    const tbody = document.getElementById('urlList');
    tbody.innerHTML = ''; // Clear existing content

    if (urls.length === 0) {
        const noHistoryMessage = document.createElement('tr');
        const noHistoryCell = document.createElement('td');
        noHistoryCell.colSpan = 3; // Match the number of columns in the table
        noHistoryCell.textContent = 'No URL history available.';
        noHistoryMessage.appendChild(noHistoryCell);
        tbody.appendChild(noHistoryMessage);
    } else {
        urls.forEach(url => {
            const row = document.createElement('tr');

            const originalUrlCell = document.createElement('td');
            originalUrlCell.textContent = url.originalUrl;
            row.appendChild(originalUrlCell);

            const shortUrlCell = document.createElement('td');
            const shortUrlLink = document.createElement('a');
            shortUrlLink.href = url.shortUrl;
            shortUrlLink.target = '_blank';
            shortUrlLink.textContent = url.shortUrl;
            shortUrlCell.appendChild(shortUrlLink);
            row.appendChild(shortUrlCell);

            const clicksCell = document.createElement('td');
            clicksCell.textContent = url.clicks;
            row.appendChild(clicksCell);

            row.addEventListener('click', () => redirect(url.shortUrl));

            tbody.appendChild(row);
        });
    }
}


