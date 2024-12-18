import "dotenv/config";
import express from "express";
import cors from "cors";
import { Worker } from "./worker";
import jwt from "json-web-token";

const SECRET = process.env.PROBLEM_SECRET as string;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend is Up");
});

app.post("/submission", async (req, res) => {
  try {
    const { problemId, code, selectedLanguage } = req.body.data;
    const data = await Worker(code, selectedLanguage, problemId);
    jwt.encode(SECRET, data, "HS256", (err, token) => {
      if (err) {
        return res.status(500).json({
          message: "Error encoding token",
          error: err,
        });
      }
      res.status(200).json({
        message: "Code run successfully",
        response: token,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Error running the code", error: error });
  }
});

app.listen(3003, () => {
  console.log(`Server is listening on port 3003`);
});
