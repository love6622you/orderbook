import React from "react";
import styled from "styled-components";

interface QuoteRowProps {
  price: number;
  size: number;
  total: number;
  percent?: number; // 背景用
}

const SC_DivWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  text-align: right;
`;

const QuoteRow = ({ price, size, total }: QuoteRowProps) => {
  return (
    <SC_DivWrapper>
      <span>
        {price.toLocaleString(undefined, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}
      </span>
      <span>{size.toLocaleString()}</span>
      <span>{total.toLocaleString()}</span>
    </SC_DivWrapper>
  );
};

export default QuoteRow;
