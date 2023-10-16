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
      userEmail: req.body.userEmail,
      message: req.body.message,
    });
    const saveContact = await contact.save();

    // Send confirmation email

    const mailOptions = {
      from: "infousummarise@gmail.com",
      to: contact.userEmail,
      subject: "YOUSUMMARISE",
      html: `Thank You For Contacting Us`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    const To = {
      from: contact.userEmail,
      to: "infousummarise@gmail.com",
      subject: "YOUSUMMARISE",
      html: `
      Query Type: ${req.body.query},
      First Name: ${req.body.firstName},
      Last Name: ${req.body.lastName},
      Email: ${req.body.userEmail},
      Message: ${req.body.message},
      `,
    };

    transporter.sendMail(To, (err, info) => {
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
