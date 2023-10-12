import express from "express";
import http from "http";
import dotenv from "dotenv";
import connectDB from "./db.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import summary from "./routes/Summary.js";
import auth from "./routes/auth.js";
import contact from "./routes/contact.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/api", summary);
app.use("/auth", auth);
app.use("/api", contact);

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`AI-Video-Summary ${process.env.PORT}`);
});
