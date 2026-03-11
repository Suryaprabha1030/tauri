import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const sections = [
  "Overview",
  "Price History",
  "Financial Sheets",
  "Peers",
  "PE/PB History",
  "Trends",
  "Technicals",
  "Documents",
  "Pivots & News",
];

const StockInfoNavbar = ({ info, scopeId }) => {
  const [activeSection, setActiveSection] = useState("Overview");
  const [scrollBar, setScrollBar] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const containsInfo = info && Object.entries(info)?.length > 0;
  const scopedId = (section: string) => `${scopeId}-${section}`;

  useEffect(() => {
    function showScrollBars() {
      if (navbarRef.current) {
        const overFlow =
          navbarRef.current?.scrollWidth > navbarRef.current?.clientWidth;
        setScrollBar(overFlow);
      }
    }

    showScrollBars();

    window.addEventListener("resize", showScrollBars);

    return () => window.removeEventListener("resize", showScrollBars);
  }, []);

  useEffect(() => {
    if (!scopeId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id.replace(`${scopeId}-`, ""));
          }
        });
      },
      { rootMargin: "-50% 0px -60% 0px" }
    );

    sections.forEach((section) => {
      const el = document.getElementById(scopedId(section));
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [scopeId]);

  useEffect(() => {
    if (!activeSection || !navbarRef.current) return;

    const container = navbarRef.current;
    const btn = container.querySelector(`[data-section="${activeSection}"]`);
    if (!btn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const offset =
      btnRect.left -
      containerRect.left -
      containerRect.width / 2 +
      btnRect.width / 2;

    container.scrollTo({
      left: container.scrollLeft + offset,
      behavior: "auto",
    });
  }, [activeSection]);

  return (
    <div
      className={`sticky  md:top-[6.5rem] lg:top-16 ${containsInfo ? "top-[5.5rem] xl:top-[6.5rem]" : "top-[3rem] xl:top-[4rem]"} z-30 w-[100%] bg-white  2xl:top-16`}
    >
      <nav
        ref={navbarRef}
        className="flex justify-evenly overflow-x-scroll border-2 border-gray-200 px-2 py-1 scrollbar-none"
      >
        {sections?.map((section, index) => (
          <button
            key={index}
            data-section={section}
            className={`${activeSection === section ? "text-lg font-[550] text-[#4CA858]" : "px-1.5 text-[0.9rem] font-[450] text-gray-400"} relative mx-1 flex-shrink-0  rounded-md  border-gray-200 transition-all duration-300 ease-in-out hover:cursor-pointer max-sm:text-[0.85rem]`}
            onClick={() => {
              document
                .getElementById(scopedId(section))
                ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }}
          >
            {section}
          </button>
        ))}
        {scrollBar && (
          <button
            onClick={() =>
              navbarRef.current?.scrollTo({
                left: navbarRef.current.scrollWidth,
                behavior: "smooth",
              })
            }
            className="absolute right-0 top-1/2 mx-auto h-full w-4 -translate-y-1/2 bg-black bg-opacity-50 text-white"
          >
            <Image
              src="/svg/scroll-arrow.svg"
              alt=""
              width={10}
              height={20}
              className=" mx-auto"
            />
          </button>
        )}
        {scrollBar && (
          <button
            onClick={() =>
              navbarRef.current?.scrollTo({ left: 0, behavior: "smooth" })
            }
            className="absolute left-0 top-1/2 mx-auto h-full w-4 -translate-y-1/2 bg-black bg-opacity-50 text-white"
          >
            <Image
              src="/svg/scroll-arrow.svg"
              alt=""
              width={10}
              height={20}
              className="mx-auto rotate-180"
            />
          </button>
        )}
      </nav>
    </div>
  );
};
export default StockInfoNavbar;
