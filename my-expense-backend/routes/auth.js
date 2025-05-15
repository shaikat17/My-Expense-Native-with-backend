import express from "express";
import { loginUser, registerUser } from "../controllers/Authcontroller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Signup for new user
router.post('/signup', registerUser);

// Login for existing user
router.post('/login', loginUser);

export default router;
