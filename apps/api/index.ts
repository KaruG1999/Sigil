import express from "express";
import cors from "cors";
import { scanRepository } from "@sigil/core";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/scan", async (req, res) => {
  const { repo } = req.body || {};

  if (!repo || typeof repo !== "string") {
    return res.status(400).json({ status: "error", message: "Missing 'repo' in request body" });
  }

  try {
    const { score, findings } = await scanRepository(repo);
    return res.json({ status: "success", score, findings });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ status: "error", message });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`SIGIL API running on http://localhost:${port}`);
});
