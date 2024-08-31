// public/script.js
const socket = io();

const joinBtn = document.getElementById('join-btn');
const usernameInput = document.getElementById('username');
const chatSection = document.getElementById('chat-section');
const joinSection = document.getElementById('join-section');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const joinError = document.getElementById('join-error');
const chatStatus = document.getElementById('chat-status');

joinBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit('join', username);
  }
});

socket.on('joined', (data) => {
  if (data.success) {
    joinSection.style.display = 'none';
    chatSection.style.display = 'block';
    chatStatus.textContent = `Welcome, ${data.username}!`;
  } else {
    joinError.textContent = data.message;
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    socket.emit('chat message', { message });
    input.value = '';
  }
});

socket.on('chat message', (data) => {
  const li = document.createElement('li');
  li.textContent = `${data.username}: ${data.message}`;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('user joined', (username) => {
  const li = document.createElement('li');
  li.textContent = `${username} joined the chat`;
  li.style.fontStyle = 'italic';
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('user left', (username) => {
  const li = document.createElement('li');
  li.textContent = `${username} left the chat`;
  li.style.fontStyle = 'italic';
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('chat start', (message) => {
  chatStatus.textContent = message;
});
