import express from "express";
import { requestEducatorAccess, getAllEducatorRequests, updateEducatorRequestStatus, getEducatorStats } from "../controllers/educator.controller.js";
import { authUser, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/request", authUser, requestEducatorAccess);
router.get("/requests", authUser, isAdmin, getAllEducatorRequests);
router.put("/request/:requestId", authUser, isAdmin, updateEducatorRequestStatus);
router.get("/stats/:educatorId", authUser, getEducatorStats);

export default router;
