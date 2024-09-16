
const socket = io('http://localhost:8000');

const loginContainer = document.getElementById('login-container');
const chatNav = document.getElementById('chat-nav');
const messageContainer = document.querySelector('.container');

const sendForm = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const errorMessage = document.getElementById('error-message');
const audio = new Audio('ring.mp3');

// Handle password submission
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    
    // Send password to the server for validation
    socket.emit('password-check', password);
});

socket.on('password-result', (result) => {
    if (result.valid) {
        loginContainer.style.display = 'none';
        chatNav.style.display = 'block';
        document.querySelector('.send').style.display = 'block';
        messageContainer.style.display = 'block';

        // Handle text message submission
        sendForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = messageInput.value;
            append(`You: ${message}`, 'right');
            socket.emit('send', message);
            messageInput.value = '';
        });

        // Listen for events from the server
        socket.on('receive', (data) => {
            append(`${data.name}: ${data.message}`, 'left');
        });

        socket.on('user-joined', (name) => {
            append(`${name} joined the chat`, 'center');
        });

        socket.on('left', (name) => {
            append(`${name} left the chat`, 'center');
        });

        const name = prompt("Enter your name to join");
        socket.emit('new-user-joined', name);
    } else {
        errorMessage.textContent = 'Invalid password. Please try again.';
    }
});

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', position);
    messageElement.innerHTML = message;
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
    messageContainer.scrollTop = messageContainer.scrollHeight;
};
