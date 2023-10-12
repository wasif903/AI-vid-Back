import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL if required
  auth: {
    user: "mynextek@gmail.com",
    pass: "yxhxeyvxanonktfz",
  },
  tls: { rejectUnauthorized: false },
});

export default transporter;


// Send confirmation email
//     const mailOptions = {
//       from: "mynextek@gmail.com",
//       to: targetUser.email,
//       subject: "New Interest Card Recieved",
//       html: `${sender.email} Sent You An Interest Card`,
//     };

//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });
