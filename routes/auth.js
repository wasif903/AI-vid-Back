import express from "express";
import Auth from "../models/Auth.js";

const router = express.Router();

router.post("/sign-up", async (req, res) => {
  try {
    const findUser = await Auth.findOne({ email: req.body.email });
    if (findUser) {
      res.status(400).json({ message: "Unauthorized" });
      return;
    }

    const createUser = new Auth({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const saveUser = await createUser.save();

    res.status(200).json(saveUser);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const findUser = await Auth.findOne({ email: req.body.email });
    if (!findUser) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }
    if (
      findUser.password === req.body.password &&
      findUser.email === req.body.email
    ) {
      res.status(200).json({ message: "Loggin successfully", findUser });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
export default router;
