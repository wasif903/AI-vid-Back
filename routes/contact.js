import express from "express";
import contactSchema from "../models/contactSchema.js";

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const contact = new contactSchema({
      query: req.body.query,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });
    const saveContact = await contact.save();
    res.status(200).json(saveContact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
