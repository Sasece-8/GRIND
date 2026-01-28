import express from "express";
import cors from "cors";
import connectDB from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import courseRoutes from "./routes/course.route.js";
import sectionRoutes from "./routes/section.route.js";
import lectureRoutes from "./routes/lecture.route.js";
import enrollmentRoutes from "./routes/enrollment.route.js";
import importCourses from "./routes/import.course.js";
import educatorRoutes from "./routes/educator.route.js";
import paymentRoutes from "./routes/payment.route.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- MIDDLEWARE ---------- */
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://grind-lms.vercel.app"], // React (Vite) frontend & Vercel deployment
    credentials: true,
  })
);

/* ---------- ROUTES ---------- */
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/auth", userRoutes);
app.use("/course", courseRoutes);
app.use("/section", sectionRoutes);
app.use("/lecture", lectureRoutes);
app.use("/enrollment", enrollmentRoutes);
app.use("/import", importCourses);
app.use("/educator", educatorRoutes);
app.use("/payment", paymentRoutes);

/* ---------- ERROR HANDLER ---------- */
app.use((err, req, res, next) => {
  console.error('--- Global Error Handler ---');
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

/* ---------- SERVER ---------- */
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.timeout = 600000; // 10 minutes
server.keepAliveTimeout = 610000;

export default app;
