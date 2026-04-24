import express from "express";
import cors from "cors";
import { processHierarchyData } from "./processor.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
  })
);
app.use(express.json());

const IDENTITY = {
  user_id: "fullname_ddmmyyyy",
  email_id: "your@college.edu",
  college_roll_number: "RA2211XXXXXXX"
};

app.post("/bfhl", (req, res) => {
  const { data } = req.body || {};

  if (data === undefined) {
    return res.status(400).json({ error: "`data` key is required and must be an array." });
  }
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "`data` must be an array." });
  }

  const result = processHierarchyData(data);
  return res.json({
    ...IDENTITY,
    ...result
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
