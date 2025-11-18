import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.js";
import { connectDB } from "./config/connection.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get('/config', (req, res) => {
  const origin = `${req.protocol}://${req.get('host')}`;
  res.json({ backendOrigin: origin });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use("/models", express.static("public/models", {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".bin")) {
      res.setHeader("Content-Type", "application/octet-stream");
    }
  }
}));
