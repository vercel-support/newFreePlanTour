import React from "react";
import styled from "@emotion/styled";

const ProductDetails = ({ price, product }) => {
  const { unit_amount, recurring } = price || {};
  const { description, images, name } = product || {};
  const url = images?.[0] || {};
  const { interval, interval_count } = recurring || {};

  return <div>ProductDetails</div>;
};

export default ProductDetails;
