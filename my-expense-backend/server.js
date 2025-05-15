import express from "express";

import envConfig from "./config/envConfig.js";
import connectDB from "./config/db.js";
import router from "./routes/auth.js";

const app = express();

// Middlewares
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use("/api/auth", router);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(envConfig.PORT, () => {
  console.log(`Server is running on http://localhost:${envConfig.PORT}`);
});
