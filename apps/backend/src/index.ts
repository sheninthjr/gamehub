import express from "express";
import cors from "cors";
import { Worker } from "./worker";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend is Up");
});

app.post("/submission", async (req, res) => {
  try {
    const { id, code, selectedLanguage } = req.body.data;
    const response = await Worker(code, selectedLanguage);
    res.status(200).json({ message: "Code run successfully", response });
  } catch (error) {
    res.status(500).json({ message: "Error running the code", error: error });
  }
});

app.listen(3003, () => {
  console.log(`Server is listening on port 3003`);
});
