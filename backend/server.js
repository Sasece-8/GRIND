import express from "express";
import connectDB from "./lib/db.js";
import userRoutes from "./routes/user.route.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
}); 

app.use("/auth", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;


