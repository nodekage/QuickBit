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
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const result = await response.json();
        token = result.token;
        displayResult('Login successful!');
        showUrlSection();
    } catch (error) {
        console.error('Error during login:', error.message);
        displayError('Invalid credentials');
    }
}

async function register() {
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
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
    } catch (error) {
        console.error('Error during registration:', error.message);
        displayError('Registration failed');
    }
}

async function shortenUrl() {
    const longUrl = document.getElementById('longUrl').value;

    try {
        const response = await fetch('http://localhost:3000/api/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({ originalUrl: longUrl }),
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
    try {
        const response = await fetch('http://localhost:3000/api/user/urls', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch URL history');
        }

        const urls = await response.json();
        displayHistory(urls);
    } catch (error) {
        console.error('Error fetching URL history:', error.message);
        displayError('Failed to fetch URL history');
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
    const urlList = document.getElementById('urlList');
    urlList.innerHTML = '';

    urls.forEach(url => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>Original URL:</strong> ${url.originalUrl} | <strong>Short URL:</strong> <a href="${url.shortUrl}" target="_blank">${url.shortUrl}</a> | <strong>Clicks:</strong> ${url.clicks}`;
        urlList.appendChild(listItem);
    });
}
