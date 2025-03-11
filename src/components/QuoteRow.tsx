import clsx from "clsx";
import React from "react";
import styled from "styled-components";

interface QuoteRowProps {
  side: "asks" | "bids";
  price: number;
  size: number;
  total: number;
  percent: number; // 背景用
}

const Div_Wrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  text-align: right;
  cursor: pointer;

  &:hover {
    background-color: #1e3059;
  }

  .price {
    text-align: left;

    &.asks {
      color: #ff5b5a;
    }

    &.bids {
      color: #00b15d;
    }
  }

  span {
    z-index: 10;
  }
`;

const Div_Visualizer = styled.div<Pick<QuoteRowProps, "side" | "percent">>`
  position: absolute;
  inset: 0;
  left: calc(100% - ${(props) => props.percent.toFixed(2)}%);
  width: ${(props) => props.percent.toFixed(2)}%;
  z-index: 1;

  &.asks {
    background-color: rgba(255, 90, 90, 0.12);
  }

  &.bids {
    background-color: rgba(16, 186, 104, 0.12);
  }
`;

const QuoteRow = ({ price, size, total, percent, side }: QuoteRowProps) => {
  return (
    <Div_Wrapper>
      <Div_Visualizer className={side} side={side} percent={percent} />
      <span className={clsx("price", side)}>
        {price.toLocaleString(undefined, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}
      </span>
      <span>{size.toLocaleString()}</span>
      <span>{total.toLocaleString()}</span>
    </Div_Wrapper>
  );
};

export default QuoteRow;
