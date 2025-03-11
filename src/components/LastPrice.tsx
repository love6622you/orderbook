import React from "react";
import styled from "styled-components";

interface LastPriceProps {
  price: number;
  side: "up" | "down" | "noChange";
}

const Div_LastPrice = styled.span<Pick<LastPriceProps, "side">>`
  text-align: center;
  font-weight: 700;
  padding-block: 4px;
  font-size: 20px;

  &.up {
    color: #00b15d;
    background: rgba(16, 186, 104, 0.12);
  }

  &.down {
    color: #ff5b5a;
    background: rgba(255, 90, 90, 0.12);
  }

  &.noChange {
    color: #f0f4f8;
    background: rgba(134, 152, 170, 0.12);
  }
`;

const LastPrice = ({ price, side }: LastPriceProps) => {
  const arrowMapping = {
    up: "⬆",
    down: "⬇",
    noChange: "",
  };
  return (
    <Div_LastPrice className={side} side={side}>
      {price.toLocaleString()} {arrowMapping[side]}
    </Div_LastPrice>
  );
};

export default LastPrice;
