import express from "express";

import envConfig from "./config/envConfig.js";
import connectDB from "./config/db.js";

const app = express();

// Middlewares
app.use(express.json());

// Database Connection
connectDB()

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(envConfig.PORT, () => {
  console.log(`Server is running on http://localhost:${envConfig.PORT}`);
});
