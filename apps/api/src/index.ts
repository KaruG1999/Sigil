import express from "express";
import cors from "cors";
import { scanRepository } from "@sigil/core";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/scan", async (req, res) => {
  try {
    const repo = req.query.repo as string;

    if (!repo) {
      return res.status(400).json({ error: "Missing ?repo=" });
    }

    const result = await scanRepository(repo);

    res.json(result);
  } catch (error) {
    console.error("Scan error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3002, () => {
  console.log("API listening on port 3002");
});
