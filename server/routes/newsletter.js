import express from "express";
import { subscribe, unsubscribe, listSubscribers } from "../controllers/newsletter";


const router = express.Router();

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);
router.get("/list", listSubscribers);

export default router;
