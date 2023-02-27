import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import React, { useState, useEffect } from "react";
//components
import StripeForm from "./StripeForm";
import ProductDetails from "./ProductDetails";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || "");

const Subscription = () => {
  const [price, setPrice] = useState(null);
  const [product, setProduct] = useState(null);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.post("/api/stripe-product");
      const { data } = response || {};
      const { price: stripePrice, product: stripeProduct } = data || {};
      setPrice(stripePrice);
      setProduct(stripeProduct);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <div className="row">
      <div className="column">
        <ProductDetails price={price} product={product} />
      </div>
      <div className="column">
        <Elements stripe={stripePromise}>
          <StripeForm price={price} />
        </Elements>
      </div>
    </div>
  );
};

export default Subscription;
