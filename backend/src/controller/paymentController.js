import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../models/User.js"

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe webhook handler (RAW body required)
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Stripe signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_email;

    // Determine plan type from metadata or product name
    const planType = session.metadata?.plan || "monthly";

    const currentDate = new Date();
    const validTill =
      planType === "annual"
        ? new Date(currentDate.setFullYear(currentDate.getFullYear() + 1))
        : new Date(currentDate.setMonth(currentDate.getMonth() + 1));

    try {
      const user = await User.findOneAndUpdate(
        { email: customerEmail },
        {
          isPremium: true,
          subscriptionType: planType,
          validTill: validTill,
        },
        { new: true }
      );

      if (user) {
        console.log(`✅ User upgraded to ${planType} plan:`, customerEmail);
      } else {
        console.warn(`⚠️ No user found with email: ${customerEmail}`);
      }
    } catch (err) {
      console.error("❌ Error updating user premium status:", err);
    }
  }

  res.status(200).json({ received: true });
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { email, plan } = req.body; // Get from frontend

    const priceId = plan === "annual"
      ? process.env.STRIPE_ANNUAL_PRICE_ID
      : process.env.STRIPE_MONTHLY_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `http://localhost:5777/payment-success?plan=${plan}`,
      cancel_url: "http://localhost:5777/payment-failed",
      metadata: {
        plan: plan, // Save plan in metadata
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error.message);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
};
