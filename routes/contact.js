import express from "express";
import contactSchema from "../models/contactSchema.js";
import transporter from "../utils/Nodemailer.js";

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const contact = new contactSchema({
      query: req.body.query,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      message: req.body.message,
      email: req.body.email,
    });
    const saveContact = await contact.save();

    const mailOptions = {
      from: "infoyousummarise@gmail.com",
      to: contact.email,
      subject: "YOUSUMMARIESE",
      html: `Thank You For Contacting Us`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    const mailOptions2 = {
      from: contact.email,
      to: "infoyousummarise@gmail.com",
      subject: "YOUSUMMARISE",
      html: `
      Query Type : ${req.body.query} <br/>
      Email: ${req.body.email} <br/>
      First Name: ${req.body.firstName} <br/>
      Last Name: ${req.body.lastName} <br/>
      Message: ${req.body.message} <br/>
      `,
    };

    transporter.sendMail(mailOptions2, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json(saveContact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
