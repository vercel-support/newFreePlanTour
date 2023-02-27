import stripe from "stripe";

const stripeService = stripe(process.env.STRIPE_PRIVATE_KEY);

const stripeSubscription = async (req, res) => {
  try {
    if (req.method !== "POST") {
      throw new Error(`Method ${req.method} Not Allowed`);
    }
    const { paymentMethod, priceId, email, name } = req.body;
    if (!paymentMethod) {
      throw new Error("Payment Intent is required");
    }
    if (!priceId) {
      throw new Error("Price id is required");
    }

    const customer = await stripeService.customers.create({
      email,
      name,
    });

    const response = await stripeService.subscriptions.create({
      customer: customer?.id,
      items: [{ price: priceId }],
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });
    console.log("response", response);

    res.status(200).json({
      message: "Plan is subscripted successfully.",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export default stripeSubscription;
