import express from "express";
import cors from "cors";
import { scanRepository } from "@sigil/core";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/scan", async (req, res) => {
  try {
    const { repo } = req.body;
    if (!repo) return res.status(400).json({ error: "Missing repo URL" });

    const result = await scanRepository(repo);

    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error"
    });
  }
});

app.listen(4000, () => {
  console.log("🔮 SIGIL API running on http://localhost:4000");
});
