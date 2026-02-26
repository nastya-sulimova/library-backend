const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/users");
const bookRoutes = require("./routes/books");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost" }));
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
});

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Роуты
app.use("/users", userRoutes);
app.use("/books", bookRoutes);

// Обработка несуществующих роутов (404) - ИСПРАВЛЕНО!
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Глобальный обработчик ошибок (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
