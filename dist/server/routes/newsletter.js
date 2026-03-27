"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const newsletter_1 = require("../controllers/newsletter");
const router = express_1.default.Router();
router.post("/subscribe", newsletter_1.subscribe);
router.post("/unsubscribe", newsletter_1.unsubscribe);
router.get("/list", newsletter_1.listSubscribers);
exports.default = router;
