import GetSymbolNews from "@/components/shared/ChartLayout/sidetab/News/GetSymbolNews";
import NewsBox from "@/components/shared/ChartLayout/sidetoolbar/news/NewsBox";
import Modal from "@/components/shared/popupModal";
import { setOpenSymbolNewsPopup } from "@/lib/redux/slices/CommonSlice";
import { RootState } from "@/lib/redux/Store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SymbolNews = () => {
  const [showModal, setShowModal] = useState(false);
  const OpenNewsModal: any = useSelector(
    (state: RootState) => state.common.OpenSymbolNewsPopup
  );
  const NewsDataSelected: any = useSelector(
    (state: RootState) => state.common.PopupNewsData
  );
  const SymbolNews: any = useSelector(
    (state: RootState) => state.common.SymbolNewsData
  );
  const newsSymbol: any = useSelector(
    (state: RootState) => state.common.newsSymbol
  );
  const [random, setRandom] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      SymbolNews &&
      newsSymbol &&
      SymbolNews[newsSymbol] &&
      SymbolNews[newsSymbol]?.random
    ) {
      setRandom(true);
    } else setRandom(false);
  }, [newsSymbol]);

  useEffect(() => {
    if (OpenNewsModal) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [OpenNewsModal]);

  return (
    <div>
      <Modal
        isOpen={showModal}
        onClose={() => dispatch(setOpenSymbolNewsPopup({ open: false }))}
      >
        <div className="flex max-h-[20rem] min-h-[5rem] flex-col overflow-hidden">
          <div className="flex items-center">
            <span className="mx-2 text-lg font-semibold text-z-green-500">
              News ({NewsDataSelected?.length || 0})
            </span>
            <span className="text-[0.75rem] font-medium text-gray-500">
              {random ? "Related News" : ""}
            </span>
          </div>

          {/* Scrollable container */}
          <div className="m-2 flex-1 overflow-y-auto rounded-lg border px-4 scrollbar-thin max-sm:py-1 xl:max-2xl:my-0.5">
            <NewsBox
              newsData={NewsDataSelected}
              tagTrue={true}
              AllNews={false}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SymbolNews;
