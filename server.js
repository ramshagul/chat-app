// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

let users = []; // Array to keep track of users

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user joining
  socket.on('join', (username) => {
    if (users.length < 2) {
      users.push({ id: socket.id, username });
      socket.emit('joined', { success: true, username });
      socket.broadcast.emit('user joined', username);

      // Notify both users when chat starts
      if (users.length === 2) {
        io.emit('chat start', 'Chat started with two users.');
      }
    } else {
      socket.emit('joined', { success: false, message: 'Chat is full.' });
    }
  });

  // Handle incoming messages
  socket.on('chat message', (data) => {
    const sender = users.find(user => user.id === socket.id);
    if (sender) {
      io.emit('chat message', {
        username: sender.username,
        message: data.message
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
    const userIndex = users.findIndex(user => user.id === socket.id);
    if (userIndex !== -1) {
      const username = users[userIndex].username;
      users.splice(userIndex, 1);
      socket.broadcast.emit('user left', username);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
