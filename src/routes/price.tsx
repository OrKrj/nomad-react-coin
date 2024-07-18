import React from "react";
import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";

interface IPriceContext {
  coinId: string;
}

function Price() {
  const { coinId } = useOutletContext<IPriceContext>();

  return <div>price</div>;
}

export default Price;
