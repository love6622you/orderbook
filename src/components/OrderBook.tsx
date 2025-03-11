import { useMemo } from "react";

import useLastPrice from "@/hooks/useLastPrice";
import useOrderbook from "@/hooks/useOrderbook";
import { addPercent, addTotalSums, useAsks, useBids } from "@/stores/useOrderbookSlice";
import { printContent } from "@/utils/createElement";

import LastPrice from "./LastPrice";
import QuoteRow from "./QuoteRow";

const OrderBook = () => {
  // useLastPrice();
  useOrderbook();

  const bids = useBids();
  const asks = useAsks();

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

  return (
    <section className="w-[360px] bg-[#131B29] py-[8px] text-base font-medium text-[#F0F4F8]">
      <h3 className="px-[12px] text-2xl font-bold">Order Book</h3>
      <div className="flex justify-between px-[12px] pb-[4px] text-[#8698aa]">
        <span>Price (USD)</span>
        <span>Size</span>
        <span>Total</span>
      </div>

      <div className="px-[12px]">
        {asksQuoteList.map(([price, size, total], index) => (
          <QuoteRow key={index} price={price} size={size} total={total || 0} />
        ))}
      </div>

      <LastPrice price="21,657.5" side="Buy" />

      <div className="px-[12px]">
        {bidsQuoteList.map(([price, size, total], index) => (
          <QuoteRow key={index} price={price} size={size} total={total || 0} />
        ))}
      </div>

      {/* {printContent(asksQuoteList)} */}
    </section>
  );
};

export default OrderBook;
