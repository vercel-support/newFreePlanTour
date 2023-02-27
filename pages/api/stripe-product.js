import stripe from "stripe";

const stripeService = stripe(process.env.STRIPE_PRIVATE_KEY);

const stripeProduct = async (req, res) => {
  try {
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      throw new Error("Stripe Id not found");
    }
    const price = await stripeService.prices.retrieve(priceId);
    const product = await stripeService.products.retrieve(price?.product);
    res
      .status(200)
      .json({
        message: "Stripe product fetched successfully.",
        price,
        product,
      });
  } catch (error) {
    res.status(500).json(error);
  }
};

export default stripeProduct;
