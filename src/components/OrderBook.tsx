import { useMemo } from "react";
import styled from "styled-components";

import useLastPrice from "@/hooks/useLastPrice";
import useOrderbook from "@/hooks/useOrderbook";
import { addPercent, addTotalSums, useOrderbookStore } from "@/stores/useOrderbookSlice";

import LastPrice from "./LastPrice";
import QuoteRow from "./QuoteRow";

const Section_Container = styled.section`
  min-width: 300px;
  padding-block: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #131b29;
  color: #f0f4f8;
  font-weight: 500;

  & > *:not(.lastPrice) {
    padding-inline: 12px;
  }
`;

const Div_TitleRow = styled.div`
  font-size: 1.25rem;
`;

const Div_QuoteTitleRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  color: #8698aa;
  text-align: right;

  .price {
    text-align: left;
  }
`;

const OrderBook = () => {
  const store = useOrderbookStore();
  const bids = store.bids;
  const asks = store.asks;

  // 執行兩者 websocket 的 hook
  const { lastPrice, prevLastPrice } = useLastPrice();
  useOrderbook();

  // 要渲染至 OrderBook 上的資料列表
  const asksQuoteList = useMemo(() => {
    const list = addTotalSums(asks.toSorted((a, b) => b[0] - a[0]).slice(0, 8));
    const maxTotalSum = list.at(-1)?.[2] || 0;

    return addPercent(list, maxTotalSum);
  }, [asks]);

  const bidsQuoteList = useMemo(() => {
    const list = addTotalSums(bids.toSorted((a, b) => b[0] - a[0]).slice(0, 8));
    const maxTotalSum = list.at(-1)?.[2] || 0;

    return addPercent(list, maxTotalSum);
  }, [bids]);

  const lastPriceSide = useMemo(() => {
    if (!lastPrice || !prevLastPrice || lastPrice === prevLastPrice) return "noChange";
    if (lastPrice > prevLastPrice) return "up";
    if (lastPrice < prevLastPrice) return "down";

    return "noChange";
  }, [lastPrice, prevLastPrice]);

  return (
    <Section_Container>
      {bids.length && asks.length && (
        <>
          <Div_TitleRow>Order Book</Div_TitleRow>
          <Div_QuoteTitleRow>
            <span className="price">Price (USD)</span>
            <span>Size</span>
            <span>Total</span>
          </Div_QuoteTitleRow>

          <article>
            {asksQuoteList.map(([price, size, total, percent]) => (
              <QuoteRow
                key={`ask-${price}`}
                side="asks"
                price={price}
                size={size}
                total={total || 0}
                percent={percent}
              />
            ))}
          </article>

          <LastPrice price={lastPrice} side={lastPriceSide} />

          <article>
            {bidsQuoteList.map(([price, size, total, percent]) => (
              <QuoteRow
                key={`bid-${price}`}
                side="bids"
                price={price}
                size={size}
                total={total || 0}
                percent={percent}
              />
            ))}
          </article>
        </>
      )}
    </Section_Container>
  );
};

export default OrderBook;
