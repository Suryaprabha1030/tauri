import Image from "next/image";
import { useEffect, useState } from "react";

const RiskDisclosureModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasClosed = localStorage.getItem("RiskDisclosureClose");
    if (!hasClosed) {
      setIsOpen(true);
    } else setIsOpen(false);
  }, []);

  const handleclose = () => {
    setIsOpen(false);
    localStorage.setItem("RiskDisclosureClose", "true");
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[10004] flex h-full items-center justify-center bg-black bg-opacity-50 ">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-xl:m-6 max-sm:m-4">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold max-sm:text-[0.9rem]">
          <img src="/svg/notice.svg" width={20} height={20} alt="notice" /> Risk
          disclosures on derivatives
        </h2>
        <ul className="list-inside list-disc space-y-3 text-gray-800 max-sm:text-[0.8rem]">
          <li>
            9 out of 10 individual traders in equity Futures and Options
            Segment, incurred net losses.
          </li>
          <li>
            On an average, loss makers registered net trading loss close to
            ₹50,000.
          </li>
          <li>
            Over and above the net trading losses incurred, loss makers expended
            an additional 28% of net trading losses as transaction costs.
          </li>
          <li>
            Those making net trading profits, incurred between 15% to 50% of
            such profits as transaction cost.
          </li>
        </ul>
        <p className="mt-4 text-[0.65rem] text-gray-500">
          Source:{" "}
          <a
            href="https://www.sebi.gov.in/"
            target="_blank"
            className="text-blue-600 underline"
          >
            SEBI study
          </a>{" "}
          dated January 25, 2023 on “Analysis of Profit and Loss of Individual
          Traders dealing in equity Futures and Options (F&O) Segment”, wherein
          Aggregate Level findings are based on annual Profit/Loss incurred by
          individual traders in equity F&O during FY 2021-22.
        </p>
        <div className="mt-6  text-right">
          <button
            onClick={handleclose}
            className="rounded-md bg-blue-600 p-2 text-white max-sm:text-[0.8rem] "
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskDisclosureModal;
