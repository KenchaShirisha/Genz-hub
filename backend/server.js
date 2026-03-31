const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] } });

const allowedOrigins = [
  'http://localhost:3000',
  'https://genz-hub.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/', (req, res) => res.json({ message: 'GenZ Hub API is running ✅', status: 'OK' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/problems', require('./routes/coding'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/interview', require('./routes/interview'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('join', (userId) => socket.join(userId));
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

app.set('io', io);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
