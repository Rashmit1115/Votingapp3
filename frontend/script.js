// script.js
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const votingSection = document.getElementById('voting-section');
const candidatesDiv = document.getElementById('candidates');
const voteButton = document.getElementById('vote-button');

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
try{
    const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    console.log(data);
    alert(data.msg || 'Registration successful!');
}catch(e){
    console.log(`Error: ${e}`);
}
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

   try{ const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.token) {
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        window.location.href = 'vote.html'
        // loadCandidates(); // Load candidates after login
    } else {
        alert(data.msg || 'Login failed!');
    }
}catch(e){
    console.log('error: ', e);
    alert('login failed !')
}
});

async function loadCandidates() {
    const response = await fetch('http://localhost:5000/api/candidates', { // Update this endpoint based on your actual candidates route
        headers: {
            'x-auth-token': localStorage.getItem('token')
        }
    });

    const candidates = await response.json();
    candidatesDiv.innerHTML = ''; // Clear existing candidates

    candidates.forEach(candidate => {
        const candidateElement = document.createElement('div');
        candidateElement.innerHTML = `
            <input type="radio" name="candidate" value="${candidate._id}">
            ${candidate.name} - ${candidate.party}
        `;
        candidatesDiv.appendChild(candidateElement);
    });

    votingSection.style.display = 'block';
}

voteButton.addEventListener('click', async () => {
    const selectedCandidateId = document.querySelector('input[name="candidate"]:checked').value;
try{
    const response = await fetch('http://localhost:5000/api/vote', { // Update this endpoint based on your actual voting route
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ candidateId: selectedCandidateId })
    });

    const data = await response.json();
    alert(data.msg || 'Vote cast successfully!');
}catch(e){
    console.log('error casting vote', e);
    alert("failed to cast vote ")
}
});