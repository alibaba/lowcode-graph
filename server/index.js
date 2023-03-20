const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:6006",
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  socket.on('updateTree', msg => {
    console.log(msg);
    io.emit('updateTree', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
