const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const deadlineRoutes = require("./routes/deadlines");
const cron = require("node-cron");
const Deadline = require("./models/Deadline");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/deadlines", deadlineRoutes);   // ✅ ADD HERE

// create http server so socket.io can hook into it
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

// attach io instance to app so controllers can access it
app.set('io', io);

// API Routes
app.use("/api/cases", require("./routes/caseRoutes"));
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/seed", require("./routes/seedRoutes"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// basic socket connection log
io.on('connection', socket => {
  console.log('Socket connected', socket.id);
});

// schedule daily reminder at 09:00 server time and emit upcoming deadlines
cron.schedule('0 9 * * *', async () => {
  try {
    const now = new Date();
    const until = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const upcoming = await Deadline.find({ date: { $gte: now, $lte: until }, status: 'Pending' }).sort('date');
    if (upcoming && upcoming.length > 0) {
      io.emit('deadlineReminder', upcoming);
      upcoming.forEach(d => console.log('Reminder emitted for:', d.title, d.date));

    }
  } catch (err) {
    console.error('Error in reminder cron:', err);
  }
});