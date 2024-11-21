import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.router";
import githubRouter from "./routes/github.router";
import webhookRouter from "./routes/webhook.router";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const PORT = process.env.PORT || 7001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Hello, you are in PullMate`s server");
});

app.use("/api/v1-2024/auth", authRouter);
app.use("/api/v1-2024/github", githubRouter);
app.use("/api/v1-2024/webhook", webhookRouter);

app.listen(PORT, () => {
  console.log(
    `✅ Server is up and running on port ${PORT} in ${process.env.NODE_ENV} environment`
  );
});
