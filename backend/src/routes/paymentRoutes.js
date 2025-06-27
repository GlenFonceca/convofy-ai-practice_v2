
import express from "express";
import bodyParser from "body-parser";
import { createCheckoutSession, handleStripeWebhook } from "../controller/paymentController.js";
import { protectRoute } from "../middleware/authMiddleWare.js";

const router = express.Router();


// Stripe requires raw body for webhook verification
router.post("/webhook",bodyParser.raw({ type: "application/json" }),handleStripeWebhook);

router.post("/create-checkout-session", express.json(),createCheckoutSession);

export default router;
